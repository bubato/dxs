<template>
  <!-- eslint-disable vue/no-v-html -->
  <div class="view-table" :class="[mixin_getSpaceClass(component.spaceInfo)]">
    <template v-if="component.heading === '1'">
      <table>
        <tbody>
          <tr v-for="(tr, index1) in component.tableData" :key="index1">
            <td v-for="(td, index2) in tr" :key="index2">
              {{ td }}
            </td>
          </tr>
        </tbody>
      </table>
    </template>
    <template v-if="component.heading === '2'">
      <table>
        <thead>
          <tr>
            <th v-for="(th, index) in component.tableData[0]" :key="index">
              {{ th }}
            </th>
          </tr>
        </thead>
        <tbody>
          <template v-for="(tr, index1) in component.tableData">
            <tr v-if="index1 > 0" :key="index1">
              <td v-for="(td, index2) in tr" :key="index2">
                <span v-html="td"></span>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </template>
    <template v-if="component.heading === '3'">
      <table>
        <tbody>
          <tr v-for="(tr, index1) in component.tableData" :key="index1">
            <template v-for="(data, index2) in tr">
              <th v-if="index2 === 0" :key="index2">
                {{ data }}
              </th>
              <td v-else :key="index2">
                {{ data }}
              </td>
            </template>
          </tr>
        </tbody>
      </table>
    </template>
    <p class="caption">{{ component.text }}</p>
  </div>
</template>

<script>
import cmsEditorCommonMixin from '~/mixin/cms/editor/cmsEditorCommon.js'

export default {
  name: 'ViewTable',
  mixins: [cmsEditorCommonMixin],
  props: {
    component: { type: Object, required: true },
  },
  computed: {},
  methods: {},
}
</script>

<style lang="scss" scoped></style>
