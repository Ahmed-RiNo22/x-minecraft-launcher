import { BaseState } from './services/BaseService'
import { CurseforgeState } from './services/CurseForgeService'
import { DiagnoseState } from './services/DiagnoseService'
import { InstallState } from './services/InstallService'
import { InstanceOptionsState } from './services/InstanceOptionsService'
import { InstanceModsState } from './services/InstanceModsService'
import { SaveState } from './services/InstanceSavesService'
import { InstanceState } from './services/InstanceService'
import { JavaState } from './services/JavaService'
import { LaunchState } from './services/LaunchService'
import { ResourceState } from './services/ResourceService'
import { UserState } from './services/UserService'
import { VersionState } from './services/VersionService'
import { ServiceKey, StatefulService } from './services/Service'
import { PeerState } from './services/PeerService'
import { InstanceVersionState } from './services/InstanceVersionService'

export type StateOfService<Serv> = Serv extends StatefulService<infer State>
  ? State : undefined

export type StateOfServiceKey<K> = K extends ServiceKey<infer Serv>
  ? StateOfService<Serv>
  : never

export type AllServiceMutations =
  Mutations<BaseState>
  & Mutations<CurseforgeState>
  & Mutations<DiagnoseState>
  & Mutations<InstallState>
  & Mutations<InstanceState>
  & Mutations<InstanceModsState>
  & Mutations<InstanceOptionsState>
  & Mutations<SaveState>
  & Mutations<JavaState>
  & Mutations<LaunchState>
  & Mutations<ResourceState>
  & Mutations<UserState>
  & Mutations<VersionState>
  & Mutations<PeerState>
  & Mutations<InstanceVersionState>

export type MutationKeys = keyof AllServiceMutations
export type MutationPayload<T extends MutationKeys> = AllServiceMutations[T]

export type Mutations<T> = {
  [K in keyof T as T[K] extends Function ? K : never]: T[K] extends ((payload: infer P) => void) ? P : never
}
