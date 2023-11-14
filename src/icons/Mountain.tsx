import { Svg, Path } from "react-native-svg"

export default ({ size, color }: { size: number; color: string }) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Path d="m8 3 4 8 5-5 5 15H2L8 3z" />
  </Svg>
)
