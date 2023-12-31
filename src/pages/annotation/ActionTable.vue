<template>
  <q-table
      dense
      flat
      :rows="annotationStore.actionAnnotationList"
      row-key="start"
      :columns="columnList"
      :pagination="{ rowsPerPage: 0 }"
      :filter="actionFilterList"
      :filter-method="actionFilter"
      :sort-method="actionSort"
      binary-state-sort
  >
    <template v-slot:top="props">
      <div class="col-6 q-table__title">Actions</div>
      <q-space></q-space>
      <q-btn-group flat>
        <!-- <q-btn
            size="sm"
            outline
            :icon="showFilter ? 'expand_more' : 'expand_less'"
            label="filter"
            @click="showFilter = !showFilter"
        ></q-btn> -->
        <q-btn
            size="sm"
            outline
            icon="add"
            label="add"
            @click="handleAdd"
        >
          <q-tooltip>라벨링 추가</q-tooltip>
        </q-btn>
        <!-- <q-btn
            size="sm"
            outline
            icon="new_label"
            label="add & advance"
            @click="handleAddAdvance"
        >
          <q-tooltip>add current range and advance for next</q-tooltip>
        </q-btn> -->
        <q-btn
            size="sm"
            outline
            icon="clear_all"
            label="clear"
            @click="handleClearAll"
        >
          <q-tooltip>모든 라벨링 태그 삭제</q-tooltip>
        </q-btn>
      </q-btn-group>
      <div
          class="col-12"
          v-if="showFilter"
      >
        <div class="q-mb-sm">
          <q-btn-group
              dense
              flat
          >
            <q-btn
                outline
                size="sm"
                icon="apps"
                label="select all"
                @click="handleSelectAll"
            >
              <q-tooltip>select all actions</q-tooltip>
            </q-btn>
            <q-btn
                outline
                size="sm"
                icon="clear_all"
                label="clear all"
                @click="handleClearSelectedAll"
            >
              <q-tooltip>clear all actions</q-tooltip>
            </q-btn>
          </q-btn-group>
        </div>
        <div class="q-gutter-xs row truncate-chip-labels">
          <q-chip
              v-for="action in configurationStore.actionLabelData"
              :key="action.id"
              v-model:selected="actionFilterList[action.id]"
              :label="action.name"
              style="max-width: 150px"
              color="primary"
              text-color="white"
          >
            <q-tooltip>{{ action.name }}</q-tooltip>
          </q-chip>
        </div>
      </div>
    </template>
    <template v-slot:body="props">
      <q-tr
        :class="{ 'bg-warning': props.row.end - props.row.start <= 0,
                  'bg-warning': props.row.appearance_id === 0,
                  'bg-warning': props.row.object === 0,
                  'bg-green-2': props.row === annotationStore.currentThumbnailAction,
                  'bg-red-1': props.row.appearance_id === 1,
                  'bg-yellow-1': props.row.appearance_id === 2,
                  'bg-green-1': props.row.appearance_id === 3,
                  'bg-blue-1': props.row.appearance_id === 4
                }"
      >
        <q-tooltip
            class="bg-dark text-body2"
            anchor="top middle"
            self="bottom middle" :offset="[0,0]"
            v-if="props.row.end - props.row.start <= 0"
        >동작 구간의 길이는 0보다 커야 합니다. 시작지점과 종료지점을 알맞게 지정해 주세요.
        </q-tooltip>
        <q-tooltip
            class="bg-dark text-body2"
            anchor="top middle"
            self="bottom middle" :offset="[0,40]"
            v-if="props.row.appearance_id === 0"
        >동작을 수행한 액터 번호를 지정해주세요. 시작화면을 기준으로 왼쪽부터 1, 2, 3, 4번을 부여해주세요.
        </q-tooltip>
        <q-tooltip
            class="bg-dark text-body2"
            anchor="top middle"
            self="bottom middle" :offset="[0,80]"
            v-if="props.row.object === 0"
        >적절한 동작 카테고리를 지정해주세요.
        </q-tooltip>
        <q-td auto-width>
          <q-input
              style="min-width: 100px;"
              v-model.number="props.row.start"
              dense
              borderless
              type="number"
              :debounce="1500"
              @mousewheel.prevent
          ></q-input>
        </q-td>
        <q-td auto-width>
          <q-input
              style="min-width: 100px;"
              v-model.number="props.row.end"
              dense
              borderless
              type="number"
              :debounce="1500"
              @mousewheel.prevent
          ></q-input>
        </q-td>
        <!-- duration 삭제 -->
        <!-- <q-td auto-width>
          {{ utils.toFixed2(props.row.end - props.row.start) }}
        </q-td> -->
        <!-- Select 방식 -->
        <!-- <q-td auto-width>
          <q-select
              v-model="props.row.actor_id"
              :options="actorIdList"
              dense
              options-dense
              borderless
              emit-value
              map-options
          ></q-select>
        </q-td> -->
        <!-- Input 방식 -->
        <q-td auto-width>
          <q-select
            v-model="props.row.appearance_id"
            :options="appearanceIdList"
            dense
            options-dense
            borderless
            emit-value
            map-options
          >
            <q-tooltip>화면 왼쪽부터 순서대로 등장인물 순서를 선택해 주세요</q-tooltip>
          </q-select>
        </q-td>
        <q-td auto-width>
          <q-input
                style="min-width: 100px;"
                v-model.number="props.row.actor_id"
                dense
                borderless
                type="number"
                readonly
          ></q-input>
        </q-td>
        <q-td>
          <img
              v-if="configurationStore.actionLabelData.find(label => label.id === props.row.action).thumbnail"
              class="cursor-pointer rounded-borders vertical-middle float-left q-mr-md"
              style="height: 40px;"
              :src="configurationStore.actionLabelData.find(label => label.id === props.row.action).thumbnail"
              @click="handleThumbnailPreview(props)"
              alt="thumbnail"
          />
          <q-select
              v-model="props.row.action"
              :options="actionOptionList"
              dense
              options-dense
              borderless
              emit-value
              map-options
              @update:model-value="handleActionInput(props.row)"
          ></q-select>
        </q-td>
        <q-td>
          <q-select
              v-model="props.row.object"
              :options="objectOptionMap[props.row.action]"
              dense
              options-dense
              borderless
              emit-value
              map-options
          ></q-select>
        </q-td>
        <!-- <q-td
            auto-width
            class="cursor-pointer text-center"
        >
          <q-chip
              dense
              outline
              :style="{ 'border-color': props.row.color, 'color': props.row.color }"
          >
            {{ props.row.color.toUpperCase() }}
          </q-chip>
          <q-popup-edit
              auto-save
              v-model="props.row.color"
              title="Edit the action color"
          >
            <q-color v-model="props.row.color"></q-color>
          </q-popup-edit>
        </q-td> -->
        <!-- <q-td>
          <q-input
              v-model="props.row.description"
              dense
              borderless
              type="text"
          ></q-input>
        </q-td> -->
        <q-td auto-width>
          <q-btn-group
              spread
              flat
          >
            <q-btn
                flat
                dense
                icon="gps_fixed"
                style="width: 100%"
                @click="handleGoto(props.row)"
            >
              <q-tooltip>해당 구간으로 이동</q-tooltip>
            </q-btn>
            <q-btn
                flat
                dense
                icon="edit_location_alt"
                style="width: 100%"
                @click="handleSet(props.row)"
            >
              <q-tooltip>현재 선택 구간에 맞추기</q-tooltip>
            </q-btn>
            <q-btn
                flat
                dense
                icon="delete"
                color="negative"
                style="width: 100%"
                @click="handleDelete(props.row)"
            ></q-btn>
          </q-btn-group>
        </q-td>
      </q-tr>
    </template>
  </q-table>
  <ActionThumbnailPreview/>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { ActionAnnotation } from '~/libs/annotationlib.js'
import utils from '~/libs/utils.js'
import { useAnnotationStore } from '~/store/annotation.js'
import { useConfigurationStore } from '~/store/configuration.js'
import { useMainStore } from '~/store/index.js'
import ActionThumbnailPreview from '~/components/ActionThumbnailPreview.vue'

const annotationStore = useAnnotationStore()
const configurationStore = useConfigurationStore()
const mainStore = useMainStore()

const columnList = [
  {
    name: 'start',
    align: 'center',
    label: 'start_frame',
    field: 'start',
    sortable: true,
    sort: (a, b, rowA, rowB) => a !== b ? a - b : rowA.end - rowB.end
  },
  {
    name: 'end',
    align: 'center',
    label: 'end_frame',
    field: 'end',
    sortable: true,
    sort: (a, b, rowA, rowB) => a !== b ? a - b : rowA.start - rowB.start
  },
  // duration 삭제
  // {
  //   name: 'duration',
  //   align: 'center',
  //   label: 'duration'
  // },
  {
    name: 'appearance_id',
    align: 'center',
    label: 'appearance_id',
    sortable: true
  },
  {
    name: 'actor_id',
    align: 'center',
    label: 'actor_id'
  },
  {
    name: 'action',
    align: 'center',
    label: 'category',
    field: 'action'
  },
  {
    name: 'object',
    align: 'center',
    label: 'action',
    field: 'object'
  },
  // {
  //   name: 'color',
  //   align: 'center',
  //   label: 'color',
  //   field: 'color'
  // },
  // {
  //   name: 'description',
  //   align: 'center',
  //   label: 'description',
  //   field: 'description'
  // },
  {
    name: 'operation',
    align: 'center',
    label: 'operation',
    field: 'operation'
  }
]

// header
const handleAdd = () => {
  annotationStore.actionAnnotationList.push(new ActionAnnotation(
      annotationStore.leftCurrentFrame,
      annotationStore.rightCurrentFrame,
      0,
      0,
      configurationStore.actionLabelData[0].id,
      configurationStore.actionLabelData[0].objects[0],
      // configurationStore.actionLabelData[0].color,
      // ''
  ))
}
const handleAddAdvance = () => {
  handleAdd()
  const nextFrame = annotationStore.rightCurrentFrame + 1 > annotationStore.video.frames
      ? annotationStore.rightCurrentFrame
      : annotationStore.rightCurrentFrame + 1
  // right frame -> next keyframe from action end frame + 1
  let min = annotationStore.video.frames
  let nearestKeyframe = nextFrame
  for (let i = 0; i < annotationStore.keyframeList.length; i++) {
    let distance = annotationStore.keyframeList[i] - nextFrame
    if (distance > 0 && distance < min) {
      min = distance
      nearestKeyframe = annotationStore.keyframeList[i]
    }
  }
  annotationStore.rightCurrentFrame = nearestKeyframe
  // left frame -> left frame => action end frame + 1
  annotationStore.leftCurrentFrame = nextFrame
}
const handleClearAll = () => {
  if (annotationStore.actionAnnotationList.length !== 0) {
    utils.confirm('Are you sure to delete ALL actions?').onOk(() => {
      annotationStore.currentThumbnailAction = null
      annotationStore.actionAnnotationList = []
    })
  } else {
    utils.notify('There are no actions!', 'warning')
  }
}

/// filter
const showFilter = ref(false)
const actionFilterList = ref({})
configurationStore.actionLabelData.forEach(label => {
  actionFilterList.value[label.id] = true
})
const handleSelectAll = () => {
  configurationStore.actionLabelData.forEach(label => {
    actionFilterList.value[label.id] = true
  })
}
const handleClearSelectedAll = () => {
  configurationStore.actionLabelData.forEach(label => {
    actionFilterList.value[label.id] = false
  })
  actionFilterList.value[0] = true
}
const actionFilter = (rows, filter) => {
  return rows.filter(row => filter[row.action])
}

// sort
annotationStore.currentSortedActionList = annotationStore.actionAnnotationList
const actionSort = (rows, sortBy, descending) => {
  const sortedRows = rows.slice().sort((a, b) => {
    const sortVal = a[sortBy] < b[sortBy] ? -1 : 1
    return descending ? sortVal : -sortVal
  })
  annotationStore.currentSortedActionList = sortedRows
  return sortedRows
}

// body
// appearanceIdList 추가
// const appearanceIdList = [1, 2, 3, 4]
const appearanceIdList = [
    {
      label:'1',
      value:1,
      color:"red"
    },
    {
      label:'2',
      value:2,
      color:"yellow"
    },
    {
      label:'3',
      value:3,
      color:"green"
    },
    {
      label:'4',
      value:4,
      color:"blue"
    }
  ]

const actionOptionList = computed(() => configurationStore.actionLabelData.map(label => {
  return {
    label: label.name,
    value: label.id
  }
}))
const objectOptionMap = ref({})
for (let action of configurationStore.actionLabelData) {
  const objectOptionList = []
  for (let object of configurationStore.objectLabelData) {
    if (action.objects.includes(object.id)) {
      objectOptionList.push({
        label: object.name,
        value: object.id
      })
    }
  }
  objectOptionMap.value[action.id] = objectOptionList
}
const handleThumbnailPreview = props => {
  const { row } = props
  if (configurationStore.actionLabelData.find(label => label.id === row.action).thumbnail) {
    annotationStore.currentThumbnailAction = annotationStore.currentThumbnailAction === row ? null : row
  }
}
const handleActionInput = (row) => {
  // row.color = configurationStore.actionLabelData.find(label => label.id === row.action).color
  row.object = configurationStore.actionLabelData.find(label => label.id === row.action).objects[0]
}

/// operation
const handleGoto = (row) => {
  if (typeof (row.start) === 'number') {
    annotationStore.leftCurrentFrame = row.start
  }
  if (typeof (row.end) === 'number') {
    annotationStore.rightCurrentFrame = row.end
  }
}
const handleSet = (row) => {
  row.start = annotationStore.leftCurrentFrame
  row.end = annotationStore.rightCurrentFrame
}
const handleDelete = (row) => {
  utils.confirm('Are you sure to delete this action?').onOk(() => {
    annotationStore.currentThumbnailAction = null
    for (let i in annotationStore.actionAnnotationList) {
      if (annotationStore.actionAnnotationList[i] === row) {
        annotationStore.actionAnnotationList.splice(i, 1)
      }
    }
  })
}

// keybindings
const handleKeyup = event => {
  event.stopPropagation()
  if (event.target.nodeName.toLowerCase() === 'input') {
    return false
  }
  if (event.code === 'Equal') {
    handleAdd()
  }
}
onMounted(() => {
  document.addEventListener('keyup', handleKeyup, true)
})
onUnmounted(() => {
  document.removeEventListener('keyup', handleKeyup, true)
})
</script>
