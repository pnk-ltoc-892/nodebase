"use client"
import { EmptyView, EntityContainer, EntityHeader, EntityItem, EntityList, EntityPagination, EntitySearch, ErrorView, LoadingView } from '@/components/EntityComponents'
import { useRouter } from 'next/navigation'
import { useEntitySearch } from '@/hooks/use-entity-search'
import { CredentialType } from '@/generated/prisma/browser'
import { KeyIcon } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { useCredentialsParams } from '../hooks/use-credential-params'
import { useRemoveCredential, useSuspenseCredentials } from '../hooks/use-credential'
import Image from 'next/image'
import { Credential } from '@/generated/prisma/browser'


export const CredentialsSearch = () => {
  const [params, setParams] = useCredentialsParams()
  const {searchValue, onSearchChange} = useEntitySearch({
    params,
    setParams
  })
  return (
    <EntitySearch 
      value={searchValue}
      onChange={onSearchChange}
      placeholder="Search Credentials"
    />
  )
}

export const CredentialsList = () => {
  const credentials = useSuspenseCredentials()
  
  return (
    <EntityList 
        items={credentials.data.items}
        getKey={(credential) => credential.id}
        renderItem={(credential) => <CredentialItem data={credential}/>}
        emptyView={<CredentialsEmpty />}
    />
  )
}


export const CredentialsHeader = ({disabled}: {disabled?: boolean}) => {
  
  return (
        <EntityHeader 
            title="Credentials"
            description="Create and manage your Credentials"
            newButtonHref="/credentials/new"
            newButtonLabel="New Credential"
            disabled={disabled}
        />
  )
}

export const CredentialsPagination = () => {
  const credentials = useSuspenseCredentials()
  const [params, setParams] = useCredentialsParams()

  return (
    <EntityPagination 
      disabled={credentials.isFetching}
      totalPages={credentials.data.totalPages}
      page={credentials.data.page}
      onPageChange={(page) => setParams({ ...params, page })}
    />
  )
}

export const CredentialsContainer = ({
  children
}: {
  children: React.ReactNode
}) => {
  return (
    <EntityContainer
      header={<CredentialsHeader />}
      search={<CredentialsSearch />}
      pagination={<CredentialsPagination />}
    >
      {children}
    </EntityContainer>
  )
}

export const CredentialsLoading = () => {
  return <LoadingView message="Loading Credentials..."/>
}

export const CredentialsError = () => {
  return <ErrorView message="Error Loading Credentials..."/>
}

export const CredentialsEmpty = () => {
  const router = useRouter()

  const handleCreate = () => {
    router.push(`/credentials/new`)
  }
  return (
        <EmptyView
            onNew={handleCreate}
            message="No Credentials found. Get started by creating your First Credential"
        />
  )
}

const credentialLogos: Record<CredentialType, string> = {
    [CredentialType.GEMINI]: "/logos/gemini.svg",
    [CredentialType.OPENAI]: "/logos/openai.svg",
}

export const CredentialItem = ({
  data
}: {
  data: Credential
}) => {

  const removeCredential = useRemoveCredential()

  const handleRemove = () => {
    removeCredential.mutate({ id: data.id })
  }

  const logo = credentialLogos[data.type] || "/logos/openai.svg"

  return (
    <EntityItem 
      href={`/credentials/${data.id}`}
      title={data.name}
      subtitle = {
        <>
          Updated {formatDistanceToNow(data.updatedAt, { addSuffix:true })}{" "}
          &bull; Created{" "}
          {formatDistanceToNow(data.createdAt, { addSuffix:true })} 
        </>
      }
      image={
        <div className='size-8 flex items-center justify-center'>
          <Image src={logo} alt={data.type} width={20} height={20} />
        </div>
      }
      onRemove={handleRemove}
      isRemoving={removeCredential.isPending}
    />
  )
}