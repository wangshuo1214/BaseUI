<template>
  <div class="layout">
    aaaa
  </div>
</template>

<script>

export default {
  name: 'Home',
  data() {
    return {
      dayCost: 0,
      monthCost: 0,
      yearCost: 0,
      totalCost: 0,
      sevenDayCost: [],
      sevenDayCostX: [],
      twelveMonthCost: [],
      twelveMonthCostX: [],
      dataCostX: [],
      dataCostY: [],
      costFlag: false,
      daySell: 0,
      monthSell: 0,
      yearSell: 0,
      totalSell: 0,
      sevenDaySell: [],
      sevenDaySellX: [],
      twelveMonthSell: [],
      twelveMonthSellX: [],
      dataSellX: [],
      dataSellY: [],
      sellFlag: false
    }
  },
  watch: {
    dataCostX() {
      this.$nextTick(() => {
        this.costLine()
      })
    },
    dataSellX() {
      this.$nextTick(() => {
        this.sellLine()
      })
    }
  },

  methods: {
  }

}
</script>

<style>

</style>
