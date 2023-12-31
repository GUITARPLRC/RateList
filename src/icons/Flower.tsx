import { Svg, Path, Circle } from "react-native-svg"

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
    <Path d="M12 7.5a4.5 4.5 0 1 1 4.5 4.5M12 7.5A4.5 4.5 0 1 0 7.5 12M12 7.5V9m-4.5 3a4.5 4.5 0 1 0 4.5 4.5M7.5 12H9m7.5 0a4.5 4.5 0 1 1-4.5 4.5m4.5-4.5H15m-3 4.5V15" />
    <Circle cx="12" cy="12" r="3" />
    <Path d="m8 16 1.5-1.5" />
    <Path d="M14.5 9.5 16 8" />
    <Path d="m8 8 1.5 1.5" />
    <Path d="M14.5 14.5 16 16" />
  </Svg>
)
