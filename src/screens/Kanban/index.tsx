import { useDocumentTitle } from 'utils'
import { useKanbansInProject, useProjectInUrl } from './util'
import { KanbanColumn } from './kanban-column'
import styled from '@emotion/styled'
import { SearchPanel } from './search-panel'
import { ScreenContainer } from 'components/lib'

export default function KanbanScreen() {
  useDocumentTitle('看板列表')

  const { data: currentProject } = useProjectInUrl()

  const { data: kanbans } = useKanbansInProject()

  return (
    <ScreenContainer>
      <h1>{currentProject?.name}看板</h1>
      <SearchPanel />
      <ColumnContainer>
        {kanbans?.map((kanban) => (
          <KanbanColumn kanban={kanban} key={kanban.id} />
        ))}
      </ColumnContainer>
    </ScreenContainer>
  )
}

const ColumnContainer = styled.div`
  display: flex;
  /* 看板宽度不变，内容多了就开始滚动 */
  overflow-x: scroll;
  flex: 1;
  /* margin-right: 2rem; */
`
