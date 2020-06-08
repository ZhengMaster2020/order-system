<template>
  <div>
    <Card>
      <Row type="flex" justify="end" style="padding-bottom: 24px; margin-bottom: 24px; border-bottom: 1px solid #ccc; ">
        <Button type="primary" @click="submit" :loading="submintLodaing">确认提交</Button>
      </Row>

      <Form :model="form" ref="form" inline :rules="rules">
        <Row>
          <Col span="4">
            <FormItem label="申请人" style="width: 100%">
              <Input v-model="applicant"/>
            </FormItem>
          </Col>
          <Col span="4">
            <FormItem label="下单编号" style="width: 100%">
              <Input v-model="form.supplierOrderNumber"/>
            </FormItem>
          </Col>
          <Col span="4">
            <FormItem label="慕可代码" prop="brand" style="width: 100%">
              <Select v-model="form.mkCode" clearable placeholder="品牌">
                <Option v-for="mkCode in mkCodeList" :key="mkCode.label" :value="mkCode.value" :label="mkCode.label" />
              </Select>
            </FormItem>
          </Col>
          <Col span="4">
            <FormItem label="下单时间" style="width: 100%">
              <Input v-model="form.orderTime"/>
            </FormItem>
          </Col>
          <Col span="4">
            <FormItem label="包材名称" style="width: 100%">
              <Input v-model="form.packing"/>
            </FormItem>
          </Col>
          <Col span="4">
            <FormItem label="生产供应商" style="width: 100%">
              <Input v-model="form.supplier"/>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="4">
            <FormItem label="类型" style="width: 100%">
              <Input v-model="form.packingType"/>
            </FormItem>
          </Col>
          <Col span="4">
            <FormItem label="订单数量" style="width: 100%">
              <Input v-model="form.amount"/>
            </FormItem>
          </Col>
          <Col span="4">
            <FormItem label="剩余可入库量" style="width: 100%">
              <Input v-model="form.amount"/>
            </FormItem>
          </Col>
          <Col span="4">
            <FormItem label="本次预计入库量" style="width: 100%">
              <Input v-model="form.expectedQuantity"/>
            </FormItem>
          </Col>
          <Col span="4">
            <FormItem label="仓位号" style="width: 100%">
              <Input v-model="form.positionNumber"/>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="8">
            <FormItem label="备注" style="width: 100%">
              <Input v-model="form.remark"/>
            </FormItem>
          </Col>
          <Col span="4">
            <FormItem label="下级经办人" style="width: 100%">
              <Input v-model="form.remark" disabled/>
            </FormItem>
          </Col>
        </Row>
        <div style="position: relative">
          <div class="necessary margin-bottom-10 font-size-12">送货单文件</div>
          <Upload
          ref="upload"
          :show-upload-list="false"
          :action="fileUploadURL"
          :headers="fileUploadHeaders"
          :default-file-list="form.fileItems"
          :before-upload="beforeUpload"
          :on-success="onsuccess"
          :on-remove="onremove"
          :on-error="onerror"
          >
            <Button icon="ios-cloud-upload-outline" class="margin-bottom-10">Upload files</Button>
          </Upload>
          <div class="upload-list" v-for="(file, index) in form.fileItems" :key="index">
            <a :href="file.url" :download="file.name" class="download-link">
              {{file.name}}
            </a>
            <Icon type="ios-trash-outline" size="14" class="icon-trash" @click="onremove(index)"/>
          </div>
        </div>
        <div style="color: #ff0000; font-size: 12px">请上传供应商送货副联单</div>
      </Form>
      <Spin size="large" fix v-if="spinShow"></Spin>
    </Card>
  </div>
</template>

<script>
  import Cookies from 'js-cookie'
  import {SERVER_BASE_URL} from '../../api/config'

  export default {
    data() {
      return {
        applicant: '',
        submintLodaing: false,
        spinShow: false,
        fileUrl: '',
        fileUploadURL: `${SERVER_BASE_URL}traceability/traceability/upload`,
        fileUploadHeaders: {
          Authorization: Cookies.get('authorization')
        },
        lastFiveYears: [],
        form: {
          supplierOrderNumber: 1,
          mkCode: '',
          orderTime: '',
          packing: '',
          supplierId: '李时达',
          supplier: '',
          amount: [],
          packingType: '',
          expectedQuantity: 'no',
          positionNumber: '',
          remark: '',
          fileItems: [],
        },
        rules: {
          brand: [{required: true, message: '必填项', trigger: 'change'}],
          isFillPlan: [{required: true, message: '必填项', trigger: 'change'}],
          quarter: [{required: true, message: '必填项', trigger: 'change'}],
          year: [{required: true, message: '必填项', trigger: 'change'}],
          generationCount: [{required: true, type: 'number', message: '必填项', trigger: 'blur'}],
          planName: [{required: true, message: '必填项', trigger: 'change'}],
        },
        mkCodeList: [
          {value: 'Q1', label: 'Q1'},
          {value: 'Q2', label: 'Q2'},
          {value: 'Q3', label: 'Q3'},
          {value: 'Q4', label: 'Q4'},
        ],
      }
    },
    methods: {
      submit() {
        this.$refs.form.validate(val => {
          if (val) {
            if (this.form.fileItems.length <= 0) return this.$Message.error('请上传计划文件')
            // return console.log(this.form)
            this.submintLodaing = true
            if (this.id) {
              let param = {
                id: this.id,
                params: this.form
              }
              this.$API.editProductionPlan(param).then(res => {
                if (res.code === 0) {
                  this.$Message.success('编辑成功')
                  this.$router.push('/production-plan-management/production-plan-list')
                }
              }).finally(() => {
                this.submintLodaing = false
              })
              return
            }
            this.$API.addProductionPlan(this.form).then(res => {
              if (res.code === 0) {
                this.$Message.success('添加成功')
                this.$router.push('/production-plan-management/production-plan-list')
              }
            }).finally(() => {
              this.submintLodaing = false
            })
          }
        })
      },
      beforeUpload(file) {
        const check = /.txt$/.test(file.name)
        if (check) {
          this.$Message.warning('请不要上传txt格式的文件')
        }
        return !check;
      },
      onsuccess(response) {
        if (response.code === 0) {
          this.$Message.success(response.msg)
          this.form.fileItems.push(response.data.fileUploadVo)
        } else {
          this.$Message.error('上传有误')
        }
      },
      onerror(error) {
        this.$Message.error('上传失败')
      },
      onremove(index) {
        this.form.fileItems.splice(index, 1)
      },

      // 获取计划详情
      getProductionPlanDetail(id) {
        // this.spinShow = true
        // this.$API.getProductionPlanDetail({id}).then(res => {
        //   if (res.code === 0) {
        //     let data = res.data
        //     let year = data.planNumber.match(/\d{4}/g)[0]
        //     this.form.year = year
        //     this.applicant = data.createdBy
        //     for (let key in this.form) {
        //       if (data[key]) {
        //         this.form[key] = data[key]
        //       }
        //     }
        //   }
        // }).finally(() => {
        //   this.spinShow = false
        // })
      }
    },
    mounted() {
      let userInfo = JSON.parse(window.localStorage.getItem('userInfo'))
      this.id = this.$route.query.id
      this.applicant = userInfo.realName
      if (this.id) {
        // this.getProductionPlanDetail(this.id)
      }
    }
  }
</script>

<style scoped>
  .width-200 {
    width: 200px;
  }

  .font-size-12 {
    font-size: 12px;
  }

  .necessary:before {
    content: '*';
    display: inline-block;
    margin-right: 4px;
    line-height: 1;
    font-family: SimSun;
    font-size: 12px;
    color: #ed4014;
  }

  .upload-list {
    padding: 3px 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .upload-list:hover {
    background-color: #f3f3f3;
  }

  .upload-list .download-link {
    display: block;
    flex: 1;
  }

  .upload-list .icon-trash {
    display: none;
  }

  .upload-list:hover .icon-trash {
    display: block;
    cursor: pointer;
  }
</style>