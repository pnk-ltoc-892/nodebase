import { parseAsInteger, parseAsString } from 'nuqs/server'
import { PAGINATION } from '@/config/constants'


export const workflowsParams = {
    page: parseAsInteger    // - Type safety for params
        .withDefault(PAGINATION.DEFAULT_PAGE)
        .withOptions({ clearOnDefault: true }),  // page=1(Default), remove it its useless

    pageSize: parseAsInteger
        .withDefault(PAGINATION.DEFAULT_PAGE_SIZE)
        .withOptions({ clearOnDefault: true }),

    search: parseAsString
        .withDefault("")
        .withOptions({ clearOnDefault: true }),
}