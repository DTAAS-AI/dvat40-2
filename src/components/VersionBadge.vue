<template>
  <q-badge color="primary">v{{ version }}</q-badge>
</template>

<script setup>
const version = PACKAGE_VERSION
</script>
