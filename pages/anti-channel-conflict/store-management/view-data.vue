<template>
  <div class="code-management">
    <Row class="search-form" type="flex" justify="space-between">
        <Col :md="12">
          <Select v-model="month" style="width:120px">
            <Option v-for="item in monthList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </Col>
    </Row>
  </div>  
</template>
<script>
export default {
  data () {
    return {
      month: '',
      monthList: []
    }
  },
  mounted() {
    this.getMonth()
  },
  methods: {
    getMonth () {
      let i=0
      while (i<12)
      {
        i++
        this.monthList.push({
          value: `${i}月`,
          label: `${i}月`
        })
      }
    }
  }
}
</script>
<style lang="less">
.code-management {
  .count {
    padding: 20px 0px 20px 30px;
    border: 2px solid #eee;
    border-radius: 10px;
  }
  .ivu-form-item {
    display: inline-block;
    margin-bottom: 0px;
  }
  .search-form {
    background-color: #eee;
    margin-top: 10px;
    padding: 10px 10px;
  }
}
</style>