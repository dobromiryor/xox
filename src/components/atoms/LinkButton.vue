<script setup lang="ts">
import { RouterLink } from "vue-router";
import Button from "~/components/atoms/Button.vue";
</script>

<template>
  <RouterLink to="/" v-slot="{ href, navigate }" tabindex="-1">
    <Button v-bind="$attrs" :href="href" @click.capture="navigate">
      <slot></slot>
    </Button>
  </RouterLink>
</template>
