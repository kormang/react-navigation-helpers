import { defineAction } from 'redux-define'

const CUSTOM_NAVIGATION = defineAction('CustomNavigation')
export const NESTED_RESET = CUSTOM_NAVIGATION.defineAction('nested-reset')
export const RESTORE = CUSTOM_NAVIGATION.defineAction('restore')
export const BATCH_NAVIGATION = CUSTOM_NAVIGATION.defineAction('batch-navigation')
