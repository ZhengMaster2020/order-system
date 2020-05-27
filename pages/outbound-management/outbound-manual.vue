<template>
  <div>
    <Card>
      <Row type="flex" justify="end" style="padding-bottom: 24px; margin-bottom: 24px; border-bottom: 1px solid #ccc; ">
        <Button type="primary" @click="submit" :loading="submintLodaing">确认提交</Button>
      </Row>

      <Form :model="form" ref="form" inline :rules="rules">
        <Row class="margin-bottom-10 title">
          <Col>
            基础信息
          </Col>
        </Row>
        <Row>
          <Col span="4">
            <FormItem label="申请时间" style="width: 100%">
              <Input v-model="detailData.createdAt" disabled/>
            </FormItem>
          </Col>
          <Col span="4">
            <FormItem label="品牌" style="width: 100%">
              <Input v-model="detailData.brand" readonly/>
            </FormItem>
          </Col>
          <Col span="4">
            <FormItem label="出库单号" style="width: 100%">
              <Input v-model="detailData.outboundOrderSn" readonly/>
            </FormItem>
          </Col>
          <Col span="4">
            <FormItem label="灌包订单号" style="width: 100%">
              <Input v-model="detailData.gbOrderSn" readonly/>
            </FormItem>
          </Col>
          <Col span="4">
            <FormItem label="订单数量" style="width: 100%">
              <Input v-model="detailData.orderNumber" readonly/>
            </FormItem>
          </Col>
          <Col span="4">
            <FormItem label="预计本次出库量" style="width: 100%">
              <Input v-model="detailData.expectedOutboundNumber" readonly/>
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span="4">
            <FormItem label="剩余可出库量" style="width: 100%">
              <Input v-model="detailData.orderNumber" readonly/>
            </FormItem>
          </Col>
          <Col span="4">
            <FormItem label="要求货期" style="width: 100%">
              <Input v-model="detailData.requireDeliveryTime" readonly/>
            </FormItem>
          </Col>
          <Col span="4">
            <FormItem label="供应商名称" style="width: 100%">
              <Input v-model="detailData.supplier" readonly/>
            </FormItem>
          </Col>
          <Col span="4">
            <FormItem label="慕可代码" style="width: 100%">
              <Input v-model="detailData.mkCode" readonly/>
            </FormItem>
          </Col>
          <Col span="4">
            <FormItem label="产品名称" style="width: 100%">
              <Input v-model="detailData.productName" readonly/>
            </FormItem>
          </Col>
          <Col span="4">
            <FormItem label="紧急程度" style="width: 100%">
              <Input v-model="detailData.urgency" readonly/>
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span="4">
             <FormItem label="是否补发" style="width: 100%">
              <Input v-model="detailData.isReissue" readonly/>
            </FormItem>
          </Col>
          <Col span="4">
             <FormItem label="补发类型" style="width: 100%">
              <Input v-model="detailData.reissueType" readonly/>
            </FormItem>
          </Col>
          <Col span="4">
             <FormItem label="损耗记录单" style="width: 100%">
              <Input v-model="detailData.lossSn" readonly/>
            </FormItem>
          </Col>
          <Col span="4">
             <FormItem label="损耗数量" style="width: 100%">
              <Input v-model="detailData.lossNumber" readonly/>
            </FormItem>
          </Col>
          <Col span="8">
             <FormItem label="出库理由" style="width: 100%">
              <Input v-model="detailData.outboundReason" readonly/>
            </FormItem>
          </Col>
        </Row>


        <Row class="margin-bottom-10">
          <Col >
            <span class="title">手动出库</span>
            <a style="font-size: 12px" href="javascript:void(0)" @click="toOutbountRecord">&nbsp;&nbsp;&nbsp;点击供应商查看出库记录>></a>
          </Col>
        </Row>
        <Row>
          <Col span="4">
            <FormItem label="出库人员" style="width: 100%"  readonly>
              <Input v-model="userInfo.realName"/>
            </FormItem>
          </Col>
          <Col span="4">
            <FormItem label="实际点货总量" style="width: 100%" readonly>
              <Input v-model="detailData.urgency"/>
            </FormItem>
          </Col>
          <Col span="4">
            <FormItem label="出库单剩余可出库量" style="width: 100%" readonly>
              <Input v-model="detailData.remainNumTotal"/>
            </FormItem>
          </Col>
          <Col span="4">
            <FormItem label="出库仓位号" style="width: 100%">
              <Input v-model="form.warehouseSn"/>
            </FormItem>
          </Col>
          <Col span="8">
            <div class="upload-list-wrap">
              <div>
                <div class="necessary margin-bottom-10 font-size-12">上传出库回传单</div>
                <Upload
                ref="upload"
                :format="['jpg','jpeg','png']"
                :show-upload-list="false"
                :action="fileUploadURL"
                :headers="fileUploadHeaders"
                :default-file-list="form.fileItems"
                :on-format-error="(file) => onFormatError(file, '回传单')"
                :before-upload="(file) => beforeUpload(file, '回传单')"
                :on-success="(response) => onsuccess(response, '回传单')"
                :on-error="(error) => onerror(error, '回传单')"
                >
                  <Button icon="ios-cloud-upload-outline" class="margin-bottom-10">Upload files</Button>
                </Upload>
              </div>
              <div class="upload-file">
                <div class="upload-list" v-for="(file, index) in form.fileItems" :key="index">
                  <a :href="file.url" :download="file.name" class="download-link">
                    {{file.name}}
                  </a>
                  <Icon type="ios-trash-outline" size="14" class="icon-trash" @click="onremove(index, '回传单')"/>
                </div>
              </div>
            </div>
          </Col>
        </Row>
        <Row class="margin-bottom-10">
          <Col span="20">
<!--            <Button icon="ios-cloud-upload-outline">导入序列号表格</Button>-->
<!--            &nbsp;&nbsp;&nbsp;<a href="javascript:void(0)">xxxx.xlsx</a>-->
            <div class="upload-list-wrap">
              <div>
                <div class="necessary margin-bottom-10 font-size-12">导入序列号表格</div>
                <Upload
                ref="upload"
                :format="['jpg','jpeg','png']"
                :show-upload-list="false"
                :action="serialCodeDataURL"
                :headers="fileUploadHeaders"
                :default-file-list="form.serialCodeData"
                :on-format-error="(file) => onFormatError(file, '导入序列号')"
                :before-upload="(file) => beforeUpload(file, '导入序列号')"
                :on-success="(response) => onsuccess(response, '导入序列号')"
                :on-error="(error) => onerror(error, '导入序列号')"
                >
                  <Button icon="ios-cloud-upload-outline" class="margin-bottom-10">Upload files</Button>
                </Upload>
              </div>
              <div class="upload-file">
                <div class="upload-list" v-for="(file, index) in form.serialCodeData" :key="index">
                  <a :href="file.url" :download="file.name" class="download-link">
                    {{file.name}}
                  </a>
                  <Icon type="ios-trash-outline" size="14" class="icon-trash" @click="onremove(index, '导入序列号')"/>
                </div>
              </div>
            </div>
          </Col>
          <Col span="4" style="text-align: right; margin-top: 35px">
            <Button type="primary" @click="exportOutboundtemplate">下载导入模板</Button>
          </Col>
        </Row>

<!--   TODO： for serialCodeData     -->
        <Row >
          <Col span="2">
            <FormItem label="序号" style="width: 100%">
              <Input v-model="form.urgency"/>
            </FormItem>
          </Col>
          <Col span="2">
            <FormItem label="编号" style="width: 100%">
              <Input v-model="form.urgency"/>
            </FormItem>
          </Col>
          <Col span="4">
            <FormItem label="序列号起止" style="width: 100%;">
              <Input v-model="form.urgency"/>
            </FormItem>
          </Col>
          <Col span="1" style="padding-top: 34px; text-align: center">——</Col>
          <Col span="4">
            <FormItem style="width: 100%; padding-top: 34px">
              <Input v-model="form.urgency"/>
            </FormItem>
          </Col>
          <Col span="4">
            <FormItem label="理论出库量" style="width: 100%">
              <Input v-model="form.urgency"/>
            </FormItem>
          </Col>
          <Col span="4">
            <FormItem label="实际点货量" style="width: 100%">
              <Input v-model="form.urgency"/>
            </FormItem>
          </Col>
          <Col span="3">
            <FormItem label=" " style="width: 100%; padding-top: 34px">
<!--              <Button shape="circle" icon="md-add" @click="addBatchData" v-if="index === 0"></Button>-->
              <Button shape="circle" icon="md-remove"></Button>
            </FormItem>
          </Col>
        </Row>

        <Row class="margin-top-10">
          <Col span="2" offset="15"  style=" text-align: right; padding-top: 10px"> 总计 </Col>
          <Col span="4"><Input v-model="form.urgency"/></Col>
        </Row>

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
        submintLodaing: false,
        spinShow: false,
        requireDeliveryTime: '',
        fileUploadURL: `${SERVER_BASE_URL}traceability/traceability/upload`,
        serialCodeDataURL: `${SERVER_BASE_URL}traceability/outbound-apply/data-import`,
        fileUploadHeaders: {
          Authorization: Cookies.get('authorization')
        },
        userInfo: {
          realName: ''
        },
        form: {
          outboundApplyId: 1,
          warehouseSn: '',
          fileItems: [{
            url: '/adas/asda',
            name: 'asda'
          },{
            url: '/adas/asda',
            name: 'asda'
          },{
            url: '/adas/asda',
            name: 'asda'
          }],

          serialCodeData: [{
            url: '/adas/asda',
            name: 'asda'
          }],
          serialCodeItems: [],
        },
        rules: {
          gbOrderSn: [{required: true, message: '必填项', trigger: 'blur'}],
          reissueType: [{required: true, message: '必填项', trigger: 'blur'}],
          lossSn: [{required: true, message: '必填项', trigger: 'blur'}],
          lossNumber: [{required: true, message: '必填项', trigger: 'blur'}],
          nextBy: [{required: true, message: '必填项', trigger: 'blur'}],
          expectedOutboundNumber: [{required: true, message: '必填项', trigger: 'blur'}],
          outboundReason: [{required: true, message: '必填项', trigger: 'blur'}],
          generationCount: [{required: true, type: 'number', message: '必填项', trigger: 'change'}],
        },
        detailData: {
          createdBy: '',
          createdAt: '',
          outboundOrderSn: '',
          brand: '',
          gbOrderSn: '',
          orderNumber: '',
          mkCode: '',
          productName: '',
          productType: '',
          requireDeliveryTime: '',
          supplier: '',
          isReissue: '',
          reissueType: '',
          lossSn: '',
          outboundReason: '',
          handleBy: '',
          expectedOutboundNumber: '',
          remainNumTotal: '',
        },
      }
    },
    methods: {

      toOutbountRecord() {
        this.$router.push({
          name: 'outbound-management/CKSQ-outbound-application',
          params: {
            currentTab: 'outboundRecord'
          }
        })
      },

      beforeUpload(file, type) {
        console.log(type)
        if(type === '回传单'){

        } else {
          // 单个文件 上传多个会覆盖？
          const check = /.txt$/.test(file.name)
          if (check) {
            this.$Message.warning('请不要上传txt格式的文件')
          }
          return !check;
        }

      },
      onFormatError(response, type) {
        if(type === '回传单') {
          this.$Message.error('上传格式有误，只允许图片格式".jsp, .png, .jpeg"')
        } else {
          console.log(response)
        }

      },
      onsuccess(response, type) {
        if(type === '回传单') {
          if (response.code === 0) {
            this.$Message.success(response.msg)
            this.form.fileItems.push(response.data.fileUploadVo)
          } else {
            this.$Message.error('上传有误')
          }
        } else {
          console.log(response)
        }

      },
      onerror(error, type) {
        this.$Message.error('上传失败')
      },
      // onOverMaxSize() {
      //   this.$Message.warning('上传文件最大15m')
      // },
      onremove(index, type) {
        if(type === '回传单') {
          this.form.fileItems.splice(index, 1)
        }else {
          console.log(index)
        }
      },

      submit() {
        this.$refs.form.validate(val => {
          if (!val) return
          console.log(this.form)
          // addOutboundLsit
        })
      },

      getOutboundDetail(id) {
        this.spinShow = true
        this.$API.getOutboundLsitDetail(id).then(res => {
          // console.log(res)
          // if (res.code !== 0) return
          this.spinShow = false
          for (let key in res.data) {
            this.detailData[key] = res.data[key]
          }
        })
      },

      getOutboundApplySnNum(id) {
        console.log(id)
        this.$API.getOutboundApplySnNum(id).then(res => {
          // console.log(res)
          // if (res.code !== 0) return
          // 出库单剩余可出库量
          this.detailData.remainNumTotal = res.data[0] + res.data[1]
        })
      },

      exportOutboundtemplate() {
        this.$API.exportOutboundtemplate().then(res => {
          console.log(res)
          // if (res.code !== 0) return
          this.spinShow = false

        })
      },

    },
    computed: {
      // 实际点货量汇总
      realNumTotal() {
        // 汇总每个序列号实际点货量

      },
      // 出库单剩余可出库量
      // remainNumTotal() {},
      // 理论出库量
      theoreticalNumTotal() {},
    },
    mounted() {
      let userInfo = JSON.parse(window.localStorage.getItem('userInfo'))
      this.id = this.$route.query.id
      this.userInfo = userInfo

      if(this.id) {
        this.getOutboundDetail(this.id)
        this.getOutboundApplySnNum(this.id)
      }
    }
  }
</script>

<style scoped>
  .necessary:before {
    content: '*';
    display: inline-block;
    margin-right: 4px;
    line-height: 1;
    font-family: SimSun;
    font-size: 12px;
    color: #ed4014;
  }

  .title {
    font-size: 16px;
    font-weight: 700;
  }

  .upload-list-wrap {
    display: flex;
    position: relative;
    top: 4px
  }

  .upload-file {
    flex: 1;
    display: flex;
    align-items: flex-end;
    flex-wrap: wrap;
    padding-left: 10px;
  }

  .upload-list {
    flex: 1;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 3px 4px;
    margin-bottom: 3px;
  }

  .upload-list:hover {
    background-color: #f3f3f3;
  }

  .upload-list .download-link {
    display: block;
    flex: 1;
  }

  .upload-list .icon-trash {
    /*display: none;*/
    visibility: hidden;
  }

  .upload-list:hover .icon-trash {
    /*display: block;*/
    visibility: visible;
    cursor: pointer;
  }

</style>