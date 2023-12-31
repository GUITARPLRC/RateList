import { Svg, Path } from "react-native-svg"

export default ({ size, color }: { size: number; color: string }) => (
  <Svg viewBox="0 0 32 32" width={size} height={size}>
    <Path
      fill={color}
      d="M26.5 10.5l-13.5 13.5h-5v-5l13.5-13.5zM28.188 8.813l-5-5 1.752-1.752c0.583-0.583 1.538-0.583 2.121 0l2.879 2.879c0.583 0.583 0.583 1.538 0 2.121l-1.752 1.752zM24 17.612v10.388h-20v-20h11l4-4h-16c-1.65 0-3 1.35-3 3v22c0 1.65 1.35 3 3 3h22c1.65 0 3-1.35 3-3v-14.98l-4 3.592z"
    />
  </Svg>
)
