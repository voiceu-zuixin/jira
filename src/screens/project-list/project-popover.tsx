import styled from '@emotion/styled'
import { List, Popover, Typography } from 'antd'
import { useProjects } from 'utils/project'

export default function ProjectPopover(props: { projectButton: JSX.Element }) {
  // 从useProjects中获取点星星后收藏的item，但是目前还没有实现点击收藏后实时刷新到下拉列表里
  // eslint-disable-next-line
  const { data: projects, isLoading } = useProjects()
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
      {/* 这里用来创建项目 */}
      {props.projectButton}
    </ContentContainer>
  )

  return (
    <Popover placement={'bottom'} content={content}>
      <span>项目</span>
    </Popover>
  )
}

const ContentContainer = styled.div`
  min-width: 30rem;
`
