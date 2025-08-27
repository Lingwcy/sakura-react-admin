import {
  Vertical,
  TwoVertical,
  Horizontal,
  Hybird,
  Empty
} from "@/components/layout"

import { useSystemStore } from "@/store"
type LayoutSettingItem = {
  key: number
  label: string
  tooTip: string
  isEnable: boolean
  isHovered?: boolean
  isSelected?: boolean
  render: () => React.JSX.Element
}


const layoutSettingItems: LayoutSettingItem[] = [
  {
    key: 1,
    label: "垂直菜单",
    tooTip: "左侧导航栏，右侧内容区域的垂直布局",
    isEnable: false,
    render: () => <Vertical />
  },
  {
    key: 2,
    label: "双列菜单",
    tooTip: "垂直双列菜单模式",
    isEnable: false,
    render: () => <TwoVertical />
  },
  {
    key: 3,
    label: "水平菜单",
    tooTip: "菜单全部显示在顶部",
    isEnable: false,
    render: () => <Horizontal />
  },
  {
    key: 4,
    label: "混合菜单",
    tooTip: "共存模式",
    isEnable: false,
    render: () => <Hybird />
  },
  {
    key: 5,
    label: "内容全屏",
    tooTip: "全屏模式",
    isEnable: false,
    render: () => <Empty />
  },
]


const useLayoutSettingItem = () => {
  const items = useSystemStore((state) => state.settingBarConfig.layoutSettingItems)
  const setItemHover = useSystemStore((state) => state.setSettingLayoutItemHover)
  const setItemSelected = useSystemStore((state) => state.setSettingLayoutItemSelected)
  const setCurrentItem = useSystemStore((state) => state.setSettingLayoutItemCurrentSelected)
  const currentSelected = useSystemStore((state) => state.settingBarConfig.currentSelected)


  const handleItemClick = (key: number) => {
    setCurrentItem(key)
    setItemSelected(key)
  }

  return {
    items,
    currentSelected,
    setItemHover,
    handleItemClick,
  }
}

export {
  useLayoutSettingItem,
  layoutSettingItems
}