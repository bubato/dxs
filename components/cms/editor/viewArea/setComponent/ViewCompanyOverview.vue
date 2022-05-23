<template>
  <div class="view-companyOverview">
    <h2 class="heading">企業概要</h2>
    <div class="contents">
      <table>
        <tr v-if="component.companyName">
          <th>会社名</th>
          <td>{{ component.companyName }}</td>
        </tr>
        <tr v-if="component.companyName">
          <th>代表者名</th>
          <td>{{ component.representativeName }}</td>
        </tr>
        <tr v-if="component.companyName">
          <th>代表電話番号</th>
          <td>{{ component.representativeNumber }}</td>
        </tr>
        <tr v-if="component.headquartersPostalCode">
          <th>本社所在地</th>
          <td>
            <p class="postal-code">
              {{ component.headquartersPostalCode }}
            </p>
            <p class="location">
              {{ component.headquartersLocation1 }}
              {{ component.headquartersLocation2
              }}{{ component.headquartersLocation3
              }}{{ component.headquartersLocation4 }}
            </p>
          </td>
        </tr>
        <tr v-if="$common.checkArrayValue(component.officer)">
          <th>役員</th>
          <td>
            <p
              v-for="(officer, index) in component.officer"
              :key="index"
              class="officer-list"
            >
              <span class="text position">{{ officer.position }}</span>
              <span class="text name">{{ officer.name }}</span>
            </p>
          </td>
        </tr>
        <tr v-if="component.foundingDate">
          <th>創業日</th>
          <td>{{ component.foundingDate }}</td>
        </tr>
        <tr v-if="component.numberOfEmployees">
          <th>従業員数</th>
          <td>{{ component.numberOfEmployees }}</td>
        </tr>
        <tr v-if="component.capital">
          <th>資本金</th>
          <td>{{ component.capital }}</td>
        </tr>
        <tr v-if="component.businessContent">
          <th>事業内容</th>
          <td>{{ component.businessContent }}</td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ViewCompanyOverview',
  props: {
    component: { type: Object, required: true },
  },
  computed: {},
  methods: {},
}
</script>

<style lang="scss" scoped></style>
