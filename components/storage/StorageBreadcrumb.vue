<template>
  <div class="breadcrumb">
    <ul>
      <li v-for="(i, index) in breadcrumb" :key="index">
        <NuxtLink
          v-if="index !== breadcrumb.length - 1"
          :to="i.pass"
          class="link-text link-color-gray"
          >{{ i.folderName }}</NuxtLink
        >
        <p
          v-else
          class="link-color-gray"
          :class="{ current: index === breadcrumb.length - 1 }"
        >
          {{ i.folderName }}
        </p>
        <KeyboardArrowRightSVG
          v-if="index !== breadcrumb.length - 1"
          class="icon-next"
        />
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'StorageBreadcrumb',
  computed: {
    ...mapState('storage/storageList', ['breadcrumb']),
  },
}
</script>

<style lang="scss" scoped>
.breadcrumb {
  padding: 19px 0 16px;
  ul {
    display: flex;
    li {
      padding-right: 4px;
      .link-text {
        text-decoration: none;
        &:hover {
          text-decoration: underline;
        }
      }
      .current {
        cursor: default;
      }
      .icon-next {
        fill: #8d8d8d;
        width: 16px;
        height: 16px;
      }
    }
  }
}
</style>
