"use client"
import { EntityContainer, EntityHeader } from '@/components/EntityComponents'
import { useCreateWorkflow, useSuspenseWorkflows } from '../hooks/use-workflows'
import { useUpgradeModal } from '../hooks/use-upgrade-modal'
import { useRouter } from 'next/navigation'


export const WorkflowsList = () => {
    const workflows = useSuspenseWorkflows()
  return (
    <div>
      {JSON.stringify(workflows.data, null, 2)}
    </div>
  )
}


export const WorkflowsHeader = ({disabled}: {disabled?: boolean}) => {
  const router = useRouter()
  const createWorkflow = useCreateWorkflow()
  const {handleError, modal} = useUpgradeModal()

  const handleCreate = () => {
    createWorkflow.mutate(undefined, {
      onSuccess: (data) => {
        router.push(`/workflows/${data.id}`)
      },
      onError: (error) => {
        handleError(error)
      }
    })
  }
  return (
    <>
      {modal}
      <EntityHeader 
        title="Workflows"
        description="Create and manage your workflows"
        onNew={handleCreate}
        newButtonLabel="New workflow"
        disabled={disabled}
        isCreating={createWorkflow.isPending}
      />
    </>
  )
}


export const WorkflowsContainer = ({
  children
}: {
  children: React.ReactNode
}) => {
  return (
    <EntityContainer
      header={<WorkflowsHeader />}
      search={<></>}
      pagination={<></>}
    >
      {children}
    </EntityContainer>
  )
}