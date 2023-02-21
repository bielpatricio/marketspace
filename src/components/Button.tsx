import {
  Button as ButtonNativeBase,
  HStack,
  IButtonProps,
  IIconProps,
  Icon,
  Text,
} from 'native-base'

type Props = IButtonProps & {
  title: string
  variant?: 'gray' | 'black' | 'purple'
  icon?: IIconProps
}

export function Button({ title, variant = 'gray', icon, ...rest }: Props) {
  return (
    <ButtonNativeBase
      w="full"
      h={14}
      bg={
        variant === 'gray'
          ? 'gray.500'
          : variant === 'purple'
          ? 'purple.300'
          : 'gray.100'
      }
      // borderWidth={variant === 'gray' ? 1 : 0}
      // borderColor="purple.300"
      rounded="lg"
      _pressed={{
        bg:
          variant === 'gray'
            ? 'gray.400'
            : variant === 'purple'
            ? 'purple.500'
            : 'gray.200',
      }}
      {...rest}
    >
      <HStack alignItems="center">
        {icon !== undefined && <Icon mr={2} as={icon} />}
        <Text
          color={variant === ('gray' || 'black') ? 'gray.200' : 'gray.700'}
          fontFamily="heading"
          fontSize="sm"
          fontWeight="bold"
        >
          {title}
        </Text>
      </HStack>
    </ButtonNativeBase>
  )
}
