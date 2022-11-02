import deepClone from 'lodash.clonedeep'
import { defineStore } from 'pinia'
import { reactive, toRefs, watch } from 'vue'
// import { validateActionLabelData, validateObjectLabelData, validateSkeletonTypeData } from './validation.js'
import { validateActionLabelData, validateObjectLabelData } from './validation.js'

const OBJECT_LABEL_LS_KEY = 'objectLabelData'
const ACTION_LABEL_LS_KEY = 'actionLabelData'
// const SKELETON_LABEL_LS_KEY = 'skeletonTypeData'

export const DEFAULT_CONFIGURATION = {
    objectLabelData: [
        {
            "id": 0,
            "name": "default",
            "color": "#CCCCCC",
            "code": "A000"
        },
        {
            "id": 1,
            "name": "주위를 둘러보며 리모컨 찾기",
            "color": "#c84f4b",
            "code": "A001"
        },
        {
            "id": 2,
            "name": "혼자 스트레칭 하기",
            "color": "#529ff0",
            "code": "A002"
        },
        {
            "id": 3,
            "name": "상대방 발로 밀치기",
            "color": "#96c28a",
            "code": "A003"
        },
        {
            "id": 4,
            "name": "상대방에게 비키라고 손짓하기",
            "color": "#7f64d6",
            "code": "A004"
        },
        {
            "id": 5,
            "name": "자리에서 비켜주기",
            "color": "#de85d1",
            "code": "A005"
        },
        {
            "id": 6,
            "name": "리모컨 들기",
            "color": "#6363d5",
            "code": "A006"
        },
        {
            "id": 7,
            "name": "소파에 앉기",
            "color": "#c9708c",
            "code": "A007"
        },
        {
            "id": 8,
            "name": "TV 전원 켜기",
            "color": "#d1deb5",
            "code": "A008"
        },
        {
            "id": 9,
            "name": "옆 사람 어깨 밀치기",
            "color": "#c7dac9",
            "code": "A009"
        },
        {
            "id": 10,
            "name": "리모컨으로 채널 조정",
            "color": "#c090df",
            "code": "A010"
        },
        {
            "id": 11,
            "name": "혼자 발장구 치기",
            "color": "#0dcfe4",
            "code": "A011"
        },
        {
            "id": 12,
            "name": "TV 가리키면서 웃기",
            "color": "#61e5fd",
            "code": "A012"
        },
        {
            "id": 13,
            "name": "스스로 얼굴 손으로 가리며 한숨 쉬기",
            "color": "#fca591",
            "code": "A013"
        },
        {
            "id": 14,
            "name": "옆에 같이 주저 앉기",
            "color": "#007f77",
            "code": "A014"
        },
        {
            "id": 15,
            "name": "자기 무릎에 고개를 파묻기",
            "color": "#acb380",
            "code": "A015"
        },
        {
            "id": 16,
            "name": "상대방 어깨 토닥거림",
            "color": "#32dda9",
            "code": "A016"
        },
        {
            "id": 17,
            "name": "고개 들며 쳐다보기",
            "color": "#ae1c2a",
            "code": "A017"
        },
        {
            "id": 18,
            "name": "아니라며 고개 젓기",
            "color": "#8e3791",
            "code": "A018"
        },
        {
            "id": 19,
            "name": "앉은 상태에서 상대방 안아주기",
            "color": "#9afa98",
            "code": "A019"
        },
        {
            "id": 20,
            "name": "상대방 머리 쓰다듬기",
            "color": "#c2d685",
            "code": "A020"
        },
        {
            "id": 21,
            "name": "상대방 어깨 토닥거리며 고개 끄덕거리기",
            "color": "#15d0c0",
            "code": "A021"
        },
        {
            "id": 22,
            "name": "상대방 손 잡기",
            "color": "#1553ed",
            "code": "A022"
        },
        {
            "id": 23,
            "name": "케이크 들고 나타나기",
            "color": "#33f274",
            "code": "A023"
        },
        {
            "id": 24,
            "name": "생일 노래 부르면서 축하해주기",
            "color": "#f5d371",
            "code": "A024"
        },
        {
            "id": 25,
            "name": "깜짝 놀라기",
            "color": "#004151",
            "code": "A025"
        },
        {
            "id": 26,
            "name": "상대방 어깨 툭툭치기",
            "color": "#c30f44",
            "code": "A026"
        },
        {
            "id": 27,
            "name": "혼자 두 손 모으기 (소원 비는 자세 )",
            "color": "#897a28",
            "code": "A027"
        },
        {
            "id": 28,
            "name": "생일 폭죽 터트리기",
            "color": "#30dcb6",
            "code": "A028"
        },
        {
            "id": 29,
            "name": "케이크 자르기",
            "color": "#bf2bd8",
            "code": "A029"
        },
        {
            "id": 30,
            "name": "케이크 접시에 덜어주기",
            "color": "#c81e3c",
            "code": "A030"
        },
        {
            "id": 31,
            "name": "선물 들고 오기",
            "color": "#e6811d",
            "code": "A031"
        },
        {
            "id": 32,
            "name": "상대방에게 선물 건네기",
            "color": "#14bf74",
            "code": "A032"
        },
        {
            "id": 33,
            "name": "문 열고 들어가기",
            "color": "#61e6ed",
            "code": "A033"
        },
        {
            "id": 34,
            "name": "앉은 상태에서 상대방에게 가볍게 목례하기",
            "color": "#5d9778",
            "code": "A034"
        },
        {
            "id": 35,
            "name": "환자에게 의자에 앉으라고 손짓하기",
            "color": "#4a1454",
            "code": "A035"
        },
        {
            "id": 36,
            "name": "의자에 앉기",
            "color": "#27bb32",
            "code": "A036"
        },
        {
            "id": 37,
            "name": "환자를 향해 돌려 앉기",
            "color": "#60c368",
            "code": "A037"
        },
        {
            "id": 38,
            "name": "의사에게 아픈 부위를 가리키며 증상 설명",
            "color": "#5e00ce",
            "code": "A038"
        },
        {
            "id": 39,
            "name": "환자 아픈곳을 보며 진찰하기",
            "color": "#6e5e38",
            "code": "A039"
        },
        {
            "id": 40,
            "name": "의자에서 일어나기",
            "color": "#0503f6",
            "code": "A040"
        },
        {
            "id": 41,
            "name": "문 열고 나가기",
            "color": "#a108c5",
            "code": "A041"
        },
        {
            "id": 42,
            "name": "주머니에서 핸드폰 꺼내기",
            "color": "#76616b",
            "code": "A042"
        },
        {
            "id": 43,
            "name": "걸으면서 핸드폰 검색하기",
            "color": "#c2e97a",
            "code": "A043"
        },
        {
            "id": 44,
            "name": "위쪽에 있는 출구 표지판 보며 두리번거리기",
            "color": "#605daf",
            "code": "A044"
        },
        {
            "id": 45,
            "name": "역무원에게 다가가기",
            "color": "#d7d41a",
            "code": "A045"
        },
        {
            "id": 46,
            "name": "역무원에게 핸드폰 보여주며 질문하기",
            "color": "#316b3b",
            "code": "A046"
        },
        {
            "id": 47,
            "name": "보여준 핸드폰 자세히 들여다보기",
            "color": "#583113",
            "code": "A047"
        },
        {
            "id": 48,
            "name": "상대방을 보면서 손으로 경로 알려주기",
            "color": "#7b2418",
            "code": "A048"
        },
        {
            "id": 49,
            "name": "알려준 방향 쳐다보며 고개 끄덕이기",
            "color": "#e073af",
            "code": "A049"
        },
        {
            "id": 50,
            "name": "손짓으로 방향 가리키며 역무원에게 다시 물어보기",
            "color": "#93e632",
            "code": "A050"
        },
        {
            "id": 51,
            "name": "고개 끄덕거리기",
            "color": "#eb0501",
            "code": "A051"
        },
        {
            "id": 52,
            "name": "셀카로 사진 찍기",
            "color": "#0afd58",
            "code": "A052"
        },
        {
            "id": 53,
            "name": "행인에게 다가가서 핸드폰 건네기",
            "color": "#ef6a7a",
            "code": "A053"
        },
        {
            "id": 54,
            "name": "핸드폰 받기",
            "color": "#317719",
            "code": "A054"
        },
        {
            "id": 55,
            "name": "일행에게 사진 찍을 장소 가리키기",
            "color": "#937798",
            "code": "A055"
        },
        {
            "id": 56,
            "name": "포즈 취하기",
            "color": "#12573b",
            "code": "A056"
        },
        {
            "id": 57,
            "name": "가까이 오라고 손짓 하기",
            "color": "#fe4720",
            "code": "A057"
        },
        {
            "id": 58,
            "name": "포즈 취하기",
            "color": "#7c59cb",
            "code": "A058"
        },
        {
            "id": 59,
            "name": "사진 찍어주기",
            "color": "#186105",
            "code": "A059"
        },
        {
            "id": 60,
            "name": "다른 포즈 유도하기",
            "color": "#48e2d6",
            "code": "A060"
        },
        {
            "id": 61,
            "name": "다시 포즈 취하기",
            "color": "#ad34eb",
            "code": "A061"
        },
        {
            "id": 62,
            "name": "핸드폰 돌려주기",
            "color": "#f40830",
            "code": "A062"
        },
        {
            "id": 63,
            "name": "핸드폰 받으면서 감사 인사 하기",
            "color": "#51c940",
            "code": "A063"
        },
        {
            "id": 64,
            "name": "모여서 사진 확인하기",
            "color": "#04b7b3",
            "code": "A064"
        },
        {
            "id": 65,
            "name": "상대방에게 핸드폰 보여주기",
            "color": "#4815b2",
            "code": "A065"
        },
        {
            "id": 66,
            "name": "컵 들고 마시는 제스처",
            "color": "#bedd65",
            "code": "A066"
        },
        {
            "id": 67,
            "name": "상대방 어깨 치면서 웃기",
            "color": "#df6acc",
            "code": "A067"
        },
        {
            "id": 68,
            "name": "기지개 펴기",
            "color": "#7071b4",
            "code": "A068"
        },
        {
            "id": 69,
            "name": "혼자 머리 정리하기",
            "color": "#eab46c",
            "code": "A069"
        },
        {
            "id": 70,
            "name": "혼자 팔짱끼고 다리 꼬기",
            "color": "#b593ca",
            "code": "A070"
        },
        {
            "id": 71,
            "name": "박수 치면서 웃기",
            "color": "#4729b6",
            "code": "A071"
        },
        {
            "id": 72,
            "name": "입 가리고 웃기",
            "color": "#352b9b",
            "code": "A072"
        },
        {
            "id": 73,
            "name": "행거에서 옷 고르기",
            "color": "#07baea",
            "code": "A073"
        },
        {
            "id": 74,
            "name": "행거에서 상대방에게 어울리는 옷 추천해주기",
            "color": "#51055e",
            "code": "A074"
        },
        {
            "id": 75,
            "name": "거울 앞에서 옷 대보기",
            "color": "#aadf25",
            "code": "A075"
        },
        {
            "id": 76,
            "name": "옷 2개 들어서 비교하기",
            "color": "#e95650",
            "code": "A076"
        },
        {
            "id": 77,
            "name": "상대방이 2개 중에 옷 골라주기",
            "color": "#15a9fa",
            "code": "A077"
        },
        {
            "id": 78,
            "name": "택에 적힌 옷 사이즈 확인하기",
            "color": "#7df8ef",
            "code": "A078"
        },
        {
            "id": 79,
            "name": "옷 들고 가서 계산하기",
            "color": "#dfc2cf",
            "code": "A079"
        },
        {
            "id": 80,
            "name": "옷 개서 쇼핑백에 넣어주기",
            "color": "#88a76c",
            "code": "A080"
        },
        {
            "id": 81,
            "name": "쇼핑백 들기",
            "color": "#6b6dfc",
            "code": "A081"
        },
        {
            "id": 82,
            "name": "점원이 90도로 인사하기",
            "color": "#db6972",
            "code": "A082"
        },
        {
            "id": 83,
            "name": "허리 숙여 인사하기",
            "color": "#f06b0e",
            "code": "A083"
        },
        {
            "id": 84,
            "name": "상대방과 악수하기",
            "color": "#4d3164",
            "code": "A084"
        },
        {
            "id": 85,
            "name": "명함 건네주기",
            "color": "#06f633",
            "code": "A085"
        },
        {
            "id": 86,
            "name": "받은 명함 보기",
            "color": "#633be8",
            "code": "A086"
        },
        {
            "id": 87,
            "name": "상대방 쳐다보며 질문하기",
            "color": "#92acff",
            "code": "A087"
        },
        {
            "id": 88,
            "name": "손짓하며 설명하기",
            "color": "#bcd428",
            "code": "A088"
        },
        {
            "id": 89,
            "name": "고개 끄덕거리며 상대방 쳐다보기",
            "color": "#88170d",
            "code": "A089"
        },
        {
            "id": 90,
            "name": "종이 쳐다보기",
            "color": "#e23b71",
            "code": "A090"
        },
        {
            "id": 91,
            "name": "고개 갸우뚱하기",
            "color": "#ee6897",
            "code": "A091"
        },
        {
            "id": 92,
            "name": "종이 쳐다보며 고개 끄덕거리기",
            "color": "#baa68f",
            "code": "A092"
        },
        {
            "id": 93,
            "name": "팔짱 끼고 고개 갸우뚱하기",
            "color": "#a0f919",
            "code": "A093"
        },
        {
            "id": 94,
            "name": "손 들어서 의견 제시하기",
            "color": "#04211c",
            "code": "A094"
        },
        {
            "id": 95,
            "name": "자리에서 일어나 악수하기",
            "color": "#b0cc76",
            "code": "A095"
        },
        {
            "id": 96,
            "name": "걸으면서 메모 들여다보기",
            "color": "#29170b",
            "code": "A096"
        },
        {
            "id": 97,
            "name": "장바구니를 들기",
            "color": "#224c37",
            "code": "A097"
        },
        {
            "id": 98,
            "name": "채소 2개 들고 비교하기",
            "color": "#4921f8",
            "code": "A098"
        },
        {
            "id": 99,
            "name": "다른 채소 들어 보여주기",
            "color": "#d24917",
            "code": "A099"
        },
        {
            "id": 100,
            "name": "채소 장바구니에 넣기",
            "color": "#3c94f1",
            "code": "A100"
        },
        {
            "id": 101,
            "name": "두리번거리면서 물건 찾기",
            "color": "#d1c1e6",
            "code": "A101"
        },
        {
            "id": 102,
            "name": "장바구니를 들고 장소 가리키기",
            "color": "#b0db92",
            "code": "A102"
        },
        {
            "id": 103,
            "name": "높은 곳을 가리키기",
            "color": "#e5b42b",
            "code": "A103"
        },
        {
            "id": 104,
            "name": "높은 곳에서 물건 꺼내기",
            "color": "#db8505",
            "code": "A104"
        },
        {
            "id": 105,
            "name": "물건 받아서 장바구니에 담기",
            "color": "#0abf66",
            "code": "A105"
        },
        {
            "id": 106,
            "name": "마이크 두손으로 쥐기",
            "color": "#9701dc",
            "code": "A106"
        },
        {
            "id": 107,
            "name": "마이크 내리고 자료화면 바라보기",
            "color": "#bac248",
            "code": "A107"
        },
        {
            "id": 108,
            "name": "자료화면 쪽으로 다가가기",
            "color": "#8b25e3",
            "code": "A108"
        },
        {
            "id": 109,
            "name": "손으로 자료 화면 가리키기",
            "color": "#200166",
            "code": "A109"
        },
        {
            "id": 110,
            "name": "자료화면을 가리킨 손을 내리고 설명하면서 정면보기",
            "color": "#66e875",
            "code": "A110"
        },
        {
            "id": 111,
            "name": "오른쪽으로 천천히 걸어가며 설명하기",
            "color": "#94357b",
            "code": "A111"
        },
        {
            "id": 112,
            "name": "앞으로 돌아보며 뒤에 있는 자료화면 가리키기",
            "color": "#4f356b",
            "code": "A112"
        },
        {
            "id": 113,
            "name": "고개 끄덕이면서 자료화면을 가리킨 손 거두기",
            "color": "#c65e14",
            "code": "A113"
        },
        {
            "id": 114,
            "name": "왼쪽으로 천천히 걸어오기",
            "color": "#38127d",
            "code": "A114"
        },
        {
            "id": 115,
            "name": "앞으로 한 발자국 나가서 90도 인사",
            "color": "#f0252a",
            "code": "A115"
        },
        {
            "id": 116,
            "name": "손으로 갯수를 세는 제스처",
            "color": "#96a3ba",
            "code": "A116"
        },
        {
            "id": 117,
            "name": "손으로 자료화면 가리키기",
            "color": "#0a9c90",
            "code": "A117"
        },
        {
            "id": 118,
            "name": "종이를 넘기는 제스처",
            "color": "#d16212",
            "code": "A118"
        },
        {
            "id": 119,
            "name": "종이를 쳐다보다가 고개를 들면서",
            "color": "#fc7e8a",
            "code": "A119"
        },
        {
            "id": 120,
            "name": "팔짱을 끼면서",
            "color": "#b5c2d5",
            "code": "A120"
        },
        {
            "id": 121,
            "name": "두 손을 무릎 위에 올리면서",
            "color": "#2b817c",
            "code": "A121"
        },
        {
            "id": 122,
            "name": "두 손으로 허공에 원을 그리면서",
            "color": "#e9b522",
            "code": "A122"
        },
        {
            "id": 123,
            "name": "그린 원의 일부분을 표현하면서 (ex 더 작은 원을 그리며)",
            "color": "#a9c89a",
            "code": "A123"
        },
        {
            "id": 124,
            "name": "왼손으로 뒤에 전시된 작품을 지칭하는 제스처",
            "color": "#989b21",
            "code": "A124"
        },
        {
            "id": 125,
            "name": "손을 내리지말고 고개만 돌려 관객을 보면서 작품 설명",
            "color": "#c673a1",
            "code": "A125"
        },
        {
            "id": 126,
            "name": "손을 내리면서 마이크 쥔 손을 바꾸기",
            "color": "#489fa6",
            "code": "A126"
        },
        {
            "id": 127,
            "name": "큐카드를 넘기고 내용 확인",
            "color": "#f2d656",
            "code": "A127"
        },
        {
            "id": 128,
            "name": "큐카드를 내리고 정면 보면서 설명하기",
            "color": "#18a10b",
            "code": "A128"
        },
        {
            "id": 129,
            "name": "관객들에게 앞으로 한 발짝 다가가기",
            "color": "#76f019",
            "code": "A129"
        },
        {
            "id": 130,
            "name": "멀리 있는 관객을 가리키는 제스처 (질문 받는 제스처)",
            "color": "#ff1723",
            "code": "A130"
        },
        {
            "id": 131,
            "name": "손을 거두면서 고개 끄덕이기",
            "color": "#c61f18",
            "code": "A131"
        },
        {
            "id": 132,
            "name": "관객 뒤쪽에 있는 작품을 가리키며",
            "color": "#3829e6",
            "code": "A132"
        },
        {
            "id": 133,
            "name": "관객 뒤쪽에 있는 작품 쪽으로 이동",
            "color": "#e401b8",
            "code": "A133"
        },
        {
            "id": 134,
            "name": "손을 흔들며 인사",
            "color": "#6f5839",
            "code": "A134"
        },
        {
            "id": 135,
            "name": "두 손으로 제품을 들어서 보여주면서",
            "color": "#b8084a",
            "code": "A135"
        },
        {
            "id": 136,
            "name": "손으로 시청자 카메라 를 가리키면서",
            "color": "#04d137",
            "code": "A136"
        },
        {
            "id": 137,
            "name": "손뼉을 치면서",
            "color": "#411b4f",
            "code": "A137"
        },
        {
            "id": 138,
            "name": "손을 뻗어서 제품을 더 가까이 보여주면서",
            "color": "#68431a",
            "code": "A138"
        },
        {
            "id": 139,
            "name": "두 손을 모으면서",
            "color": "#81c70b",
            "code": "A139"
        },
        {
            "id": 140,
            "name": "제품의 장점을 손으로 세면서 (첫번째, 두번째)",
            "color": "#fff7f4",
            "code": "A140"
        },
        {
            "id": 141,
            "name": "손으로 최고 표시를 하면서",
            "color": "#98d833",
            "code": "A141"
        },
        {
            "id": 142,
            "name": "앉은 상태로 마무리 인사",
            "color": "#455d44",
            "code": "A142"
        }
    ],
    actionLabelData: [
        {
            "id": 0,
            "name": "default",
            "color": "#CCCCCC",
            "objects": [
                0
            ]
        },
        {
            "id": 1,
            "name": "일상생활(TV시청)",
            "color": "#320a01",
            "objects": [
                1,
                2,
                3,
                4,
                5,
                6,
                7,
                8,
                9,
                10,
                11,
                12
            ]
        },
        {
            "id": 2,
            "name": "위로",
            "color": "#771045",
            "objects": [
                13,
                14,
                15,
                16,
                17,
                18,
                19,
                20,
                21,
                22
            ]
        },
        {
            "id": 3,
            "name": "생일축하",
            "color": "#c25878",
            "objects": [
                23,
                24,
                25,
                26,
                27,
                28,
                29,
                30,
                31,
                32
            ]
        },
        {
            "id": 4,
            "name": "진료실",
            "color": "#21abf5",
            "objects": [
                33,
                34,
                35,
                36,
                37,
                38,
                39,
                40,
                41
            ]
        },
        {
            "id": 5,
            "name": "역무원에게 길 묻기",
            "color": "#935f80",
            "objects": [
                42,
                43,
                44,
                45,
                46,
                47,
                48,
                49,
                50,
                51
            ]
        },
        {
            "id": 6,
            "name": "사진 찍어주기",
            "color": "#77d717",
            "objects": [
                52,
                53,
                54,
                55,
                56,
                57,
                58,
                59,
                60,
                61,
                62,
                63,
                64
            ]
        },
        {
            "id": 7,
            "name": "근황토크",
            "color": "#b8d14c",
            "objects": [
                65,
                66,
                67,
                68,
                69,
                70,
                71,
                72
            ]
        },
        {
            "id": 8,
            "name": "의류쇼핑",
            "color": "#fb9ce0",
            "objects": [
                73,
                74,
                75,
                76,
                77,
                78,
                79,
                80,
                81,
                82
            ]
        },
        {
            "id": 9,
            "name": "회사간 업무 미팅",
            "color": "#6b83b6",
            "objects": [
                83,
                84,
                85,
                86,
                87,
                88,
                89,
                90,
                91,
                92,
                93,
                94,
                95
            ]
        },
        {
            "id": 10,
            "name": "장보기",
            "color": "#ac4b84",
            "objects": [
                96,
                97,
                98,
                99,
                100,
                101,
                102,
                103,
                104,
                105
            ]
        },
        {
            "id": 11,
            "name": "일어선 상태에서의 발표(회사)",
            "color": "#140579",
            "objects": [
                106,
                107,
                108,
                109,
                110,
                111,
                112,
                113,
                114,
                115
            ]
        },
        {
            "id": 12,
            "name": "앉은 상태에서의 발표(회사)",
            "color": "#7aa3c3",
            "objects": [
                116,
                117,
                118,
                119,
                120,
                121,
                122,
                123
            ]
        },
        {
            "id": 13,
            "name": "일어선 상태에서의 설명(전시회)",
            "color": "#0860a4",
            "objects": [
                124,
                125,
                126,
                127,
                128,
                129,
                130,
                131,
                132,
                133
            ]
        },
        {
            "id": 14,
            "name": "앉은 상태에서의 설명(쇼호스트)",
            "color": "#ba934b",
            "objects": [
                134,
                135,
                136,
                137,
                138,
                139,
                140,
                141,
                142
            ]
        }
    ],
    currentThumbnailActionLabelId: null
}

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
    //   const { objectLabelData, actionLabelData, skeletonTypeData } = data
      const { objectLabelData, actionLabelData } = data
      importObjectLabelData(objectLabelData)
      importActionLabelData(actionLabelData)
      // importSkeletonTypeData(skeletonTypeData)
    }
  }
})