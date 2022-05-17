import { useDocumentTitle } from 'utils'
import { useKanbansInProject, useProjectInUrl } from './util'
import { KanbanColumn } from './kanban-column'
import styled from '@emotion/styled'

export default function KanbanScreen() {
  useDocumentTitle('看板列表')

  const { data: currentProject } = useProjectInUrl()

  const { data: kanbans } = useKanbansInProject()

  return (
    <div>
      <h1>{currentProject?.name}看板</h1>
      <ColumnContainer>
        {kanbans?.map((kanban) => (
          <KanbanColumn kanban={kanban} key={kanban.id} />
        ))}
      </ColumnContainer>
    </div>
  )
}

const ColumnContainer = styled.div`
  display: flex;
  overflow: hidden;
  margin-right: 2rem;
`
