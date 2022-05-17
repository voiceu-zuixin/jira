import styled from '@emotion/styled'
import { Divider, List, Popover, Typography } from 'antd'
import { ButtonNoPadding } from 'components/lib'
import { useProjects, useProjectsMoal } from 'utils/project'

export default function ProjectPopover() {
  const { open } = useProjectsMoal()

  // 从useProjects中获取点星星后收藏的item，但是目前还没有实现点击收藏后实时刷新到下拉列表里
  // eslint-disable-next-line
  const { data: projects, refetch } = useProjects()
  const pinnedProjects = projects?.filter((project) => project.pin)

  const content = (
    <ContentContainer>
      <Typography.Text type={'secondary'}>收藏项目</Typography.Text>
      {/* 收藏项目的列表 */}
      <List>
        {pinnedProjects?.map((project) => (
          <List.Item key={project.id}>
            <List.Item.Meta title={project.name} />
          </List.Item>
        ))}
      </List>

      {/* 分割线 */}
      <Divider />

      {/* 这里用来创建项目 */}
      <ButtonNoPadding onClick={open} type={'link'}>
        创建项目
      </ButtonNoPadding>
    </ContentContainer>
  )

  return (
    <Popover onVisibleChange={()=>refetch()} placement={'bottom'} content={content}>
      <span>项目</span>
    </Popover>
  )
}

const ContentContainer = styled.div`
  min-width: 30rem;
`
