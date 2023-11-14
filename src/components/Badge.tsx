import { View } from "react-native"
import { colors } from "../styles"
import {
  Rocket,
  Castle,
  Crown,
  Flower,
  Gem,
  Medal,
  Mountain,
  Blocks,
  Trophy,
} from "../icons"

const Badge = ({ badgeType }: { badgeType: BadgeTypes }) => {
  const props = {
    size: 24,
    color: colors.white,
  }
  const getIcon = () => {
    switch (badgeType) {
      case "rocket":
        return <Rocket {...props} />
      case "castle":
        return <Castle {...props} />
      case "crown":
        return <Crown {...props} />
      case "flower":
        return <Flower {...props} />
      case "gem":
        return <Gem {...props} />
      case "medal":
        return <Medal {...props} />
      case "mountain":
        return <Mountain {...props} />
      case "blocks":
        return <Blocks {...props} />
      case "trophy":
        return <Trophy {...props} />
      default:
        return null
    }
  }
  return (
    <View
      key={badgeType}
      style={{
        backgroundColor: colors.black,
        borderRadius: 5,
        justifyContent: "center",
        alignItems: "center",
        width: props.size * 2,
        height: props.size * 2,
      }}
    >
      {getIcon()}
    </View>
  )
}

export default Badge
