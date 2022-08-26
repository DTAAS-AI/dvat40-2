import { copyToClipboard, exportFile } from 'quasar'
import { ref } from 'vue'
import utils from '~/libs/utils.js'
import { useAnnotationStore } from '~/store/annotation.js'
// import { useConfigurationStore } from '~/store/configuration.js'
import { useConfigurationStore } from '~/store/configuration.js'
import { useMainStore } from '~/store/index.js'

export const useAnnotation = () => {
  const configurationStore = useConfigurationStore()
  const annotationStore = useAnnotationStore()
  const mainStore = useMainStore()
  const submitLoading = ref(false)
  const loadAnnotation = (obj) => {
    try {
      // const {
      //   version,
      //   info,
      //   // TODO : project info 추가
      //   annotation,
      //   config
      // } = obj
      // 변수 선언부 개별 분리, 필요한 내용만 로드하도록 수정
      const version = obj.version;
      const info = obj.info;
      const annotation = obj.annotation;
      // // config -> project에 따라 달리 불러오도록 수정
      // let config = obj.config;
      // version
      if (version !== PACKAGE_VERSION) {
        utils.notify('Version mismatch, weird stuff is likely to happen! ' + version + ' != ' + PACKAGE_VERSION,
          'warning')
      }
      // // config -> project에 따라 달리 불러오도록 수정
      // if (info.project === '40-1'){
      //   config = CONFIGURATION_40_1
      // } else if (info.project === '40-2'){
      //   config = CONFIGURATION_40_2
      // } else {
      //   config = DEFAULT_CONFIGURATION
      // }
      // configurationStore.importConfig(config)
      // annotation
      annotationStore.importAnnotation(annotation)
      utils.notify('Annotation load successfully!', 'positive')
    } catch (e) {
      utils.notify(e.toString(), 'negative')
      throw e
    }
  }
  const loadAnnotationFromFile = () => {
    utils.importFile().then(file => {
      loadAnnotation(JSON.parse(file))
    })
  }
  return {
    loadAnnotation,
    handleLoad: () => {
      if (annotationStore.hasVideo) {
        utils.confirm(
          'Are you sure to load? This would override current data!'
        ).onOk(() => {
          loadAnnotationFromFile()
        })
      } else {
        loadAnnotationFromFile()
      }
    },
    handleSave: () => {
      //프로젝트 미선택시 예외처리 추가
      if (annotationStore.info.project === "Select Project") {
        utils.confirm(
          '프로젝트를 지정해주세요'
        ).onOk(() => {
        })
      } else {
        utils.prompt(
          'Save',
          'Enter annotation filename for saving',
          'annotations').onOk(filename => {
          const data = {
            version: PACKAGE_VERSION,
            // TODO : project info 추가
            info: annotationStore.info,
            annotation: annotationStore.exportAnnotation(),
            // config: configurationStore.exportConfig()
          }
          exportFile(
            filename + '.json',
            new Blob([JSON.stringify(data)]),
            { mimeType: 'text/plain' }
          )
          mainStore.drawer = false
        })
      }
    },
    handleSubmit: () => {
      submitLoading.value = true
      const data = {
        version: PACKAGE_VERSION,
        annotation: annotationStore.exportAnnotation(),
        config: configurationStore.exportConfig()
      }
      console.debug('Submitting to: ' + mainStore.submitURL)
      fetch(mainStore.submitURL, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      }).then(res => {
        submitLoading.value = false
        if (res.ok) {
          console.debug('Success', res)
          res.json().then(data => {
            const { message, clipboard, type } = data
            if (message) {
              utils.notify('Server: ' + message, type || 'positive')
            }
            if (clipboard) {
              copyToClipboard(clipboard).then(() => {
                utils.notify('Copied to clipboard: ' + clipboard, 'positive', 0, 'center')
              }).catch(() => {
                  utils.notify('Failed to copy to clipboard, please do it manually: ' + clipboard, 'negative', 10000)
                }
              )
            }
          })
        } else {
          utils.notify(`Failed to submit: ${res.statusText} (${res.status})`, 'warning')
        }
      }).catch(err => {
        submitLoading.value = false
        utils.notify('Failed to submit: ' + err, 'negative')
      })
    },
    submitLoading
  }
}
