import { Button, Drawer } from 'antd'
import { useProjectsMoal } from 'utils/project'

export default function ProjectModal() {
  const { projectCreateOpen, close } = useProjectsMoal()

  return (
    <Drawer onClose={close} visible={projectCreateOpen} width={'100%'}>
      <h1>ProjectModal</h1>
      <Button onClick={close}>关闭</Button>
    </Drawer>
  )
}
