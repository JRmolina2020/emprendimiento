<template>
  <div id="app">
    <router-view />
    <notifications
      position="bottom right"
      :style="{
        bottom: '30px',
        right: '30px',
      }"
    />
  </div>
</template>

<script setup>
// vacío por ahora
</script>

<style>
body {
  background-color: #f8f9fa;
}
</style>
