<template>
  <v-tooltip
    :close-delay="0"
    left
  >
    <template #activator="{ on }">
      <v-speed-dial
        open-on-hover
        direction="bottom"
        transition="slide-y-reverse-transition"
      >
        <template #activator>
          <v-btn
            text
            fab

            small
            @click="onImport('zip')"
            v-on="on"
          >
            <v-icon
              style="font-size: 28px"
            >
              save_alt
            </v-icon>
          </v-btn>
        </template>

        <v-btn
          fab
          small
          @click="onImport('folder')"
        >
          <v-tooltip
            :close-delay="0"
            left
          >
            <template #activator="{ on: tooltip }">
              <v-icon
                v-on="tooltip"
              >
                folder
              </v-icon>
            </template>
            {{ t('profile.importFolder') }}
          </v-tooltip>
        </v-btn>

        <v-btn
          fab
          small
          @click="onImport('curseforge')"
        >
          <v-tooltip
            :close-delay="0"
            left
          >
            <template #activator="{ on: tooltip }">
              <v-icon
                style="padding-right: 2px;"
                v-on="tooltip"
              >
                $vuetify.icons.curseforge
              </v-icon>
            </template>
            {{ t('profile.importCurseforge') }}
          </v-tooltip>
        </v-btn>
      </v-speed-dial>
    </template>
    {{ t('profile.importZip') }}
  </v-tooltip>
</template>

<script lang=ts setup>
import { ModpackServiceKey } from '@xmcl/runtime-api'
import { useInstances } from '../composables/instance'
import { useI18n, useResourceOperation, useService } from '/@/composables'

const { importInstance } = useInstances()
const { showOpenDialog } = windowController
const { t } = useI18n()
const { importResource } = useResourceOperation()
const { importModpack } = useService(ModpackServiceKey)

async function onImport(type: 'zip' | 'folder' | 'curseforge') {
  const fromFolder = type === 'folder'
  const filters = fromFolder
    ? []
    : [{ extensions: ['zip'], name: 'Zip' }]
  const { filePaths } = await showOpenDialog({
    title: t('profile.import.title'),
    message: t('profile.import.description'),
    filters,
    properties: fromFolder ? ['openDirectory'] : ['openFile'],
  })
  if (filePaths && filePaths.length > 0) {
    for (const f of filePaths) {
      if (type === 'curseforge') {
        await importResource({
          path: f,
          type: 'curseforge-modpack',
          background: true,
        })
        await importModpack({ path: f, instanceConfig: {} })
      } else {
        await importInstance(f)
      }
    }
  }
}

</script>

<style>
</style>
