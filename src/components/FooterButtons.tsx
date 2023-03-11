import { HStack, IButtonProps } from 'native-base'
import { Button } from './Button'

type FooterButtonsProps = IButtonProps & {
  titleButton1: string
  titleButton2: string
  onPressButton1: () => void
  onPressButton2: () => void
  colorButton2: 'gray' | 'purple'
}

export function FooterButtons({
  titleButton1,
  titleButton2,
  colorButton2,
  onPressButton1,
  onPressButton2,
}: FooterButtonsProps) {
  return (
    <HStack h="100%">
      <Button
        onPress={onPressButton1}
        title={titleButton1}
        variant="gray"
        h={50}
      />
      <Button
        onPress={onPressButton2}
        title={titleButton2}
        variant={colorButton2}
        h={50}
      />
    </HStack>
  )
}
