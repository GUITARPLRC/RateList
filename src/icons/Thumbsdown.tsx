import { Svg, Path } from "react-native-svg"

export default ({
  size,
  color = "white",
}: {
  size: number
  color?: string
}) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    stroke-width="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Path d="M17 14V2" />
    <Path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22h0a3.13 3.13 0 0 1-3-3.88Z" />
  </Svg>
)
