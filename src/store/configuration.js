import deepClone from 'lodash.clonedeep'
import { defineStore } from 'pinia'
import { reactive, toRefs, watch } from 'vue'
// import { validateActionLabelData, validateObjectLabelData, validateSkeletonTypeData } from './validation.js'
import { validateActionLabelData, validateObjectLabelData } from './validation.js'

const OBJECT_LABEL_LS_KEY = 'objectLabelData'
const ACTION_LABEL_LS_KEY = 'actionLabelData'
// const SKELETON_LABEL_LS_KEY = 'skeletonTypeData'

const DEFAULT_CONFIGURATION = {
  objectLabelData: [
    {
      "id": 0,
      "name": "default",
      "color": "#00FF00",
      "code": "A00"
  },
  {
      "id": 1,
      "name": "손 짚고 앉기",
      "color": "#c84f4b",
      "code": "A01"
  },
  {
      "id": 2,
      "name": "손 짚지 않고 앉기",
      "color": "#529ff0",
      "code": "A02"
  },
  {
      "id": 3,
      "name": "앉아서 양반다리 하기",
      "color": "#96c28a",
      "code": "A03"
  },
  {
      "id": 4,
      "name": "다리 꼬기",
      "color": "#7f64d6",
      "code": "A04"
  },
  {
      "id": 5,
      "name": "정면으로 눕기",
      "color": "#de85d1",
      "code": "A05"
  },
  {
      "id": 6,
      "name": "옆으로 눕기",
      "color": "#6363d5",
      "code": "A06"
  },
  {
      "id": 7,
      "name": "엎드리기",
      "color": "#c9708c",
      "code": "A07"
  },
  {
      "id": 8,
      "name": "책상에 걸터앉기",
      "color": "#d1deb5",
      "code": "A08"
  },
  {
      "id": 9,
      "name": "선반에서 물건꺼내기",
      "color": "#c7dac9",
      "code": "A09"
  },
  {
      "id": 10,
      "name": "물건 올려두기",
      "color": "#c090df",
      "code": "A10"
  },
  {
      "id": 11,
      "name": "물건 옮기기",
      "color": "#0dcfe4",
      "code": "A11"
  },
  {
      "id": 12,
      "name": "상판 닦기",
      "color": "#61e5fd",
      "code": "A12"
  },
  {
      "id": 13,
      "name": "턱 괴기",
      "color": "#fca591",
      "code": "A13"
  },
  {
      "id": 14,
      "name": "엎드리기",
      "color": "#007f77",
      "code": "A14"
  },
  {
      "id": 15,
      "name": " 물건 넣고 닫기",
      "color": "#acb380",
      "code": "A15"
  },
  {
      "id": 16,
      "name": "물건 넣기",
      "color": "#32dda9",
      "code": "A16"
  },
  {
      "id": 17,
      "name": "내부 확인하기",
      "color": "#ae1c2a",
      "code": "A17"
  }
  ],
  actionLabelData: [
    {
      "id": 0,
      "name": "default",
      "color": "#0000FF",
      "objects": [
          0
      ]
  },
  {
      "id": 16,
      "name": "앉았다가 일어서기(의자, 소파)",
      "color": "#77CCCC",
      "objects": [
          1,
          2,
          3,
          4
      ]
  },
  {
      "id": 17,
      "name": "누웠다가 일어서기(소파)",
      "color": "#ce285a",
      "objects": [
          5,
          6,
          7
      ]
  },
  {
      "id": 18,
      "name": "서 있는 상태의 동작",
      "color": "#188940",
      "objects": [
          8,
          9,
          10,
          11,
          12
      ]
  },
  {
      "id": 19,
      "name": "앉은 상태의 동작",
      "color": "#19e7b4",
      "objects": [
          13,
          14
      ]
  },
  {
      "id": 20,
      "name": "집어넣기",
      "color": "#895dbd",
      "objects": [
          15
      ]
  },
  {
      "id": 21,
      "name": "걸터앉기",
      "color": "#28bcf7",
      "objects": [
          1,
          2,
          3
      ]
  },
  {
      "id": 22,
      "name": "눕기",
      "color": "#2b39dd",
      "objects": [
          5,
          6,
          7
      ]
  },
  {
      "id": 23,
      "name": "문 열고 닫기",
      "color": "#58d54a",
      "objects": [
          16,
          17
      ]
  }
  ],
  // skeletonTypeData: [
  //   {
  //     id: 0,
  //     name: 'human',
  //     description: 'open pose',
  //     color: '#00FF00',
  //     pointList: [
  //       {
  //         id: 0,
  //         name: 'nose',
  //         x: 0,
  //         y: -30
  //       },
  //       {
  //         id: 1,
  //         name: 'left eye',
  //         x: -3,
  //         y: -35
  //       },
  //       {
  //         id: 2,
  //         name: 'right eye',
  //         x: 3,
  //         y: -35
  //       },
  //       {
  //         id: 3,
  //         name: 'left ear',
  //         x: -7,
  //         y: -32
  //       },
  //       {
  //         id: 4,
  //         name: 'right ear',
  //         x: 7,
  //         y: -32
  //       },
  //       {
  //         id: 5,
  //         name: 'left shoulder',
  //         x: -13,
  //         y: -20
  //       },
  //       {
  //         id: 6,
  //         name: 'right shoulder',
  //         x: 13,
  //         y: -20
  //       },
  //       {
  //         id: 7,
  //         name: 'left wrist',
  //         x: -15,
  //         y: 10
  //       },
  //       {
  //         id: 8,
  //         name: 'right wrist',
  //         x: 15,
  //         y: 10
  //       },
  //       {
  //         id: 9,
  //         name: 'left hip',
  //         x: -8,
  //         y: 10
  //       },
  //       {
  //         id: 10,
  //         name: 'right hip',
  //         x: 8,
  //         y: 10
  //       },
  //       {
  //         id: 11,
  //         name: 'left knee',
  //         x: -9,
  //         y: 30
  //       },
  //       {
  //         id: 12,
  //         name: 'right knee',
  //         x: 9,
  //         y: 30
  //       },
  //       {
  //         id: 13,
  //         name: 'left ankle',
  //         x: -10,
  //         y: 45
  //       },
  //       {
  //         id: 14,
  //         name: 'right ankle',
  //         x: 10,
  //         y: 45
  //       }
  //     ],
  //     edgeList: [
  //       {
  //         id: 0,
  //         from: 0,
  //         to: 1
  //       },
  //       {
  //         id: 1,
  //         from: 0,
  //         to: 2
  //       },
  //       {
  //         id: 2,
  //         from: 0,
  //         to: 3
  //       },
  //       {
  //         id: 3,
  //         from: 0,
  //         to: 4
  //       },
  //       {
  //         id: 4,
  //         from: 0,
  //         to: 9
  //       },
  //       {
  //         id: 5,
  //         from: 0,
  //         to: 10
  //       },
  //       {
  //         id: 6,
  //         from: 5,
  //         to: 7
  //       },
  //       {
  //         id: 7,
  //         from: 5,
  //         to: 6
  //       },
  //       {
  //         id: 8,
  //         from: 6,
  //         to: 8
  //       },
  //       {
  //         id: 9,
  //         from: 9,
  //         to: 11
  //       },
  //       {
  //         id: 10,
  //         from: 11,
  //         to: 13
  //       },
  //       {
  //         id: 11,
  //         from: 10,
  //         to: 12
  //       },
  //       {
  //         id: 12,
  //         from: 12,
  //         to: 14
  //       }
  //     ]
  //   }
  // ],

  currentThumbnailActionLabelId: null
}

// const DEFAULT_CONFIGURATION_40_2 = {
//   objectLabelData: [
//     {
//       "id": 0,
//       "name": "default",
//       "color": "#00FF00",
//       "code": "A00"
//   },
//   {
//       "id": 1,
//       "name": "손 짚고 앉기",
//       "color": "#c84f4b",
//       "code": "A01"
//   },
//   {
//       "id": 2,
//       "name": "손 짚지 않고 앉기",
//       "color": "#529ff0",
//       "code": "A02"
//   },
//   {
//       "id": 3,
//       "name": "앉아서 양반다리 하기",
//       "color": "#96c28a",
//       "code": "A03"
//   },
//   {
//       "id": 4,
//       "name": "다리 꼬기",
//       "color": "#7f64d6",
//       "code": "A04"
//   },
//   {
//       "id": 5,
//       "name": "정면으로 눕기",
//       "color": "#de85d1",
//       "code": "A05"
//   },
//   {
//       "id": 6,
//       "name": "옆으로 눕기",
//       "color": "#6363d5",
//       "code": "A06"
//   },
//   {
//       "id": 7,
//       "name": "엎드리기",
//       "color": "#c9708c",
//       "code": "A07"
//   },
//   {
//       "id": 8,
//       "name": "책상에 걸터앉기",
//       "color": "#d1deb5",
//       "code": "A08"
//   },
//   {
//       "id": 9,
//       "name": "선반에서 물건꺼내기",
//       "color": "#c7dac9",
//       "code": "A09"
//   },
//   {
//       "id": 10,
//       "name": "물건 올려두기",
//       "color": "#c090df",
//       "code": "A10"
//   },
//   {
//       "id": 11,
//       "name": "물건 옮기기",
//       "color": "#0dcfe4",
//       "code": "A11"
//   },
//   {
//       "id": 12,
//       "name": "상판 닦기",
//       "color": "#61e5fd",
//       "code": "A12"
//   },
//   {
//       "id": 13,
//       "name": "턱 괴기",
//       "color": "#fca591",
//       "code": "A13"
//   },
//   {
//       "id": 14,
//       "name": "엎드리기",
//       "color": "#007f77",
//       "code": "A14"
//   },
//   {
//       "id": 15,
//       "name": " 물건 넣고 닫기",
//       "color": "#acb380",
//       "code": "A15"
//   },
//   {
//       "id": 16,
//       "name": "물건 넣기",
//       "color": "#32dda9",
//       "code": "A16"
//   },
//   {
//       "id": 17,
//       "name": "내부 확인하기",
//       "color": "#ae1c2a",
//       "code": "A17"
//   }
//   ],
//   actionLabelData: [
//     {
//       "id": 0,
//       "name": "default",
//       "color": "#0000FF",
//       "objects": [
//           0
//       ]
//   },
//   {
//       "id": 16,
//       "name": "앉았다가 일어서기(의자, 소파)",
//       "color": "#77CCCC",
//       "objects": [
//           1,
//           2,
//           3,
//           4
//       ]
//   },
//   {
//       "id": 17,
//       "name": "누웠다가 일어서기(소파)",
//       "color": "#ce285a",
//       "objects": [
//           5,
//           6,
//           7
//       ]
//   },
//   {
//       "id": 18,
//       "name": "서 있는 상태의 동작",
//       "color": "#188940",
//       "objects": [
//           8,
//           9,
//           10,
//           11,
//           12
//       ]
//   },
//   {
//       "id": 19,
//       "name": "앉은 상태의 동작",
//       "color": "#19e7b4",
//       "objects": [
//           13,
//           14
//       ]
//   },
//   {
//       "id": 20,
//       "name": "집어넣기",
//       "color": "#895dbd",
//       "objects": [
//           15
//       ]
//   },
//   {
//       "id": 21,
//       "name": "걸터앉기",
//       "color": "#28bcf7",
//       "objects": [
//           1,
//           2,
//           3
//       ]
//   },
//   {
//       "id": 22,
//       "name": "눕기",
//       "color": "#2b39dd",
//       "objects": [
//           5,
//           6,
//           7
//       ]
//   },
//   {
//       "id": 23,
//       "name": "문 열고 닫기",
//       "color": "#58d54a",
//       "objects": [
//           16,
//           17
//       ]
//   }
//   ],
//   skeletonTypeData: [
//     {
//       id: 0,
//       name: 'human',
//       description: 'open pose',
//       color: '#00FF00',
//       pointList: [
//         {
//           id: 0,
//           name: 'nose',
//           x: 0,
//           y: -30
//         },
//         {
//           id: 1,
//           name: 'left eye',
//           x: -3,
//           y: -35
//         },
//         {
//           id: 2,
//           name: 'right eye',
//           x: 3,
//           y: -35
//         },
//         {
//           id: 3,
//           name: 'left ear',
//           x: -7,
//           y: -32
//         },
//         {
//           id: 4,
//           name: 'right ear',
//           x: 7,
//           y: -32
//         },
//         {
//           id: 5,
//           name: 'left shoulder',
//           x: -13,
//           y: -20
//         },
//         {
//           id: 6,
//           name: 'right shoulder',
//           x: 13,
//           y: -20
//         },
//         {
//           id: 7,
//           name: 'left wrist',
//           x: -15,
//           y: 10
//         },
//         {
//           id: 8,
//           name: 'right wrist',
//           x: 15,
//           y: 10
//         },
//         {
//           id: 9,
//           name: 'left hip',
//           x: -8,
//           y: 10
//         },
//         {
//           id: 10,
//           name: 'right hip',
//           x: 8,
//           y: 10
//         },
//         {
//           id: 11,
//           name: 'left knee',
//           x: -9,
//           y: 30
//         },
//         {
//           id: 12,
//           name: 'right knee',
//           x: 9,
//           y: 30
//         },
//         {
//           id: 13,
//           name: 'left ankle',
//           x: -10,
//           y: 45
//         },
//         {
//           id: 14,
//           name: 'right ankle',
//           x: 10,
//           y: 45
//         }
//       ],
//       edgeList: [
//         {
//           id: 0,
//           from: 0,
//           to: 1
//         },
//         {
//           id: 1,
//           from: 0,
//           to: 2
//         },
//         {
//           id: 2,
//           from: 0,
//           to: 3
//         },
//         {
//           id: 3,
//           from: 0,
//           to: 4
//         },
//         {
//           id: 4,
//           from: 0,
//           to: 9
//         },
//         {
//           id: 5,
//           from: 0,
//           to: 10
//         },
//         {
//           id: 6,
//           from: 5,
//           to: 7
//         },
//         {
//           id: 7,
//           from: 5,
//           to: 6
//         },
//         {
//           id: 8,
//           from: 6,
//           to: 8
//         },
//         {
//           id: 9,
//           from: 9,
//           to: 11
//         },
//         {
//           id: 10,
//           from: 11,
//           to: 13
//         },
//         {
//           id: 11,
//           from: 10,
//           to: 12
//         },
//         {
//           id: 12,
//           from: 12,
//           to: 14
//         }
//       ]
//     }
//   ],

//   currentThumbnailActionLabelId: null
// }

export const useConfigurationStore = defineStore('configuration', () => {
  const defaultConfiguration = deepClone(DEFAULT_CONFIGURATION)
  const state = reactive(DEFAULT_CONFIGURATION)

  const objectLabelData = JSON.parse(localStorage.getItem(OBJECT_LABEL_LS_KEY))
  const actionLabelData = JSON.parse(localStorage.getItem(ACTION_LABEL_LS_KEY))
  // const skeletonTypeData = JSON.parse(
  //   localStorage.getItem(SKELETON_LABEL_LS_KEY))

  if (objectLabelData) state.objectLabelData = objectLabelData
  if (actionLabelData) state.actionLabelData = actionLabelData
  // if (skeletonTypeData) state.skeletonTypeData = skeletonTypeData

  watch(() => state.objectLabelData, (newValue) => {
    localStorage.setItem(OBJECT_LABEL_LS_KEY, JSON.stringify(newValue))
  }, { deep: true })
  watch(() => state.actionLabelData, (newValue) => {
    localStorage.setItem(ACTION_LABEL_LS_KEY, JSON.stringify(newValue))
  }, { deep: true })
  // watch(() => state.skeletonTypeData, (newValue) => {
  //   localStorage.setItem(SKELETON_LABEL_LS_KEY, JSON.stringify(newValue))
  // }, { deep: true })

  const importObjectLabelData = (objectLabelData) => {
    validateObjectLabelData(objectLabelData)
    state.objectLabelData = objectLabelData
  }
  const importActionLabelData = (actionLabelData) => {
    validateActionLabelData(actionLabelData)
    state.actionLabelData = actionLabelData
  }
  // const importSkeletonTypeData = (skeletonTypeData) => {
  //   validateSkeletonTypeData(skeletonTypeData)
  //   state.skeletonTypeData = skeletonTypeData
  // }
  return {
    ...toRefs(state),
    reset: () => {
      Object.keys(state).map(key => state[key] = defaultConfiguration[key])
    },
    exportConfig: () => {
      return {
        objectLabelData: state.objectLabelData,
        actionLabelData: state.actionLabelData,
        // skeletonTypeData: state.skeletonTypeData
      }
    },
    importObjectLabelData,
    importActionLabelData,
    // importSkeletonTypeData,
    importConfig: (data) => {
      const { objectLabelData, actionLabelData, skeletonTypeData } = data
      importObjectLabelData(objectLabelData)
      importActionLabelData(actionLabelData)
      // importSkeletonTypeData(skeletonTypeData)
    }
  }
})
