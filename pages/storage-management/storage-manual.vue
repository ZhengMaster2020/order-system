<template>
  <div>
  <Card>
    <Row type="flex" justify="end" style="padding-bottom: 24px; margin-bottom: 24px; border-bottom: 1px solid #ccc; ">
      <Button type="primary" @click="submit" :loading="submitLoading">确认提交</Button>
    </Row>

    <Form :model="form" ref="form" inline :rules="rules">
      <Row class="margin-bottom-10 title">
        <Col>
          基础信息
        </Col>
      </Row>
      <Row>
        <Col span="4">
          <FormItem label="申请人" style="width: 100%">
            <Input v-model="detailData.created_by" readonly/>
          </FormItem>
        </Col>
        <Col span="4">
          <FormItem label="申请时间" style="width: 100%">
            <Input v-model="detailData.created_at" readonly/>
          </FormItem>
        </Col>
        <Col span="4">
          <FormItem label="入库单号" style="width: 100%">
            <Input v-model="detailData.storage_number" readonly/>
          </FormItem>
        </Col>
        <Col span="4">
          <FormItem label="下单编号" style="width: 100%">
            <Input v-model="detailData.supplier_order_number" readonly/>
          </FormItem>
        </Col>
        <Col span="4">
          <FormItem label="订单数量" style="width: 100%">
            <Input v-model="detailData.amount" readonly/>
          </FormItem>
        </Col>
        <Col span="4">
          <FormItem label="剩余可入库量" style="width: 100%">
            <Input v-model="detailData.remain_number" readonly/>
          </FormItem>
        </Col>
      </Row>

      <Row>
        <Col span="4">
          <FormItem label="下单时间" style="width: 100%">
            <Input v-model="detailData.order_time" readonly/>
          </FormItem>
        </Col>
        <Col span="4">
          <FormItem label="生产供应商" style="width: 100%">
            <Input v-model="detailData.supplier" readonly/>
          </FormItem>
        </Col>
        <Col span="4">
          <FormItem label="包材名称" style="width: 100%">
            <Input v-model="detailData.packing" readonly/>
          </FormItem>
        </Col>
        <Col span="4">
          <FormItem label="类型" style="width: 100%">
            <Input v-model="detailData.packing_type" readonly/>
          </FormItem>
        </Col>
        <Col span="4">
          <FormItem label="本次预计入库量" style="width: 100%">
            <Input v-model="detailData.expected_quantity" readonly/>
          </FormItem>
        </Col>
        <Col span="4">
          <FormItem label="入库仓位号" style="width: 100%">
            <Input v-model="detailData.position_number" readonly/>
          </FormItem>
        </Col>
      </Row>

      <Row>
        <Col span="12">
          <FormItem label="备注" style="width: 100%">
            <Input v-model="detailData.remark" readonly/>
          </FormItem>
        </Col>
        <Col :span="isManualStorage ? 12 : 4">
          <FormItem label="送货单文件" style="width: 100%">
            <div style="padding-top: 33px; margin-top: 1px">
              <a :href="file.url" :download="file.name" class="download-link"
                 v-for="(file, index) in detailData.delivery_file"
                 :key="index">{{file.name}}</a>
            </div>
          </FormItem>
        </Col>
        <Col span="4" v-if="!isManualStorage">
          <FormItem label="剩余可入库量" style="width: 100%">
            <Input v-model="detailData.reissueType" readonly/>
          </FormItem>
        </Col>
      </Row>


      <Row class="margin-bottom-10">
        <Col >
          <span class="title">{{subTitle}}</span>
          <a style="font-size: 12px" href="javascript:void(0)" @click="toStorageRecord" v-if="isManualStorage">&nbsp;&nbsp;&nbsp;查看入库记录</a>
        </Col>
      </Row>
      <Row>
        <Col span="4">
          <FormItem label="入库员" style="width: 100%">
            <Input v-model="userInfo.realName" readonly/>
          </FormItem>
        </Col>
        <Col span="4" v-if="isManualStorage">
          <FormItem label="入库单剩余可入库量" style="width: 100%">
            <Input v-model="remainNumber" readonly/>
          </FormItem>
        </Col>
        <Col span="8" v-if="isManualStorage">
          <div class="upload-list-wrap">
            <div>
              <div class="necessary margin-bottom-10 font-size-12">上传装箱单</div>
              <Upload
              ref="upload"
              :show-upload-list="false"
              :action="fileUploadURL"
              :headers="fileUploadHeaders"
              :before-upload="(file) => beforeUpload(file)"
              :on-success="(response) => onsuccess(response)"
              :on-error="(error) => onerror(error)"
              >
                <Button icon="ios-cloud-upload-outline" class="margin-bottom-10">Upload files</Button>
              </Upload>
            </div>
            <div class="upload-file">
              <div class="upload-list" v-for="(file, index) in form.boxItems" :key="index">
                <a href="javascript:void(0)" class="download-link">{{file.name.substring(0, file.name.lastIndexOf('.'))}}</a>
                <Icon type="ios-trash-outline" size="14" class="icon-trash" @click="onremove(index)"/>
              </div>
            </div>
          </div>
        </Col>
      </Row>

      <!--   TODO： for batchData     -->
      <Row v-for="(batch, index) in this.form.batchData" :key="index">
        <Col span="2" v-if="isManualStorage">
          <FormItem :label="index === 0? '序号' : ''" style="width: 100%">
            <Input :value="index + 1" readonly/>
          </FormItem>
        </Col>
        <Col span="4">
          <FormItem :label="index === 0? '生产批次号' : ''" style="width: 100%" :prop="'batchData.' + index + '.batchNumber'" :rules="rules.batchNumber">
<!--            <Input v-model="batch.batchNumber" :readonly="batch.readonly"/>-->
            <Select
              filterable
              remote
              clearable
              :remote-method="query => remoteMethod(query,index)"
              v-model="batch.batchNumber"
              @on-change="batchNumberChange(batch.batchNumber, index)">
              <Option v-for="(items, index) in batch.options" :key="index" :value="items.value" :label="items.label" />
            </Select>
          </FormItem>
        </Col>
        <Col span="4">
          <FormItem :label="index === 0? '所属计划名称' : ''" style="width: 100%">
            <Input v-model="batch.plan_name" readonly/>
          </FormItem>
        </Col>
        <Col span="2">
          <FormItem :label="index === 0? '标类型' : ''" style="width: 100%">
            <Input v-model="batch.mark_type" readonly/>
          </FormItem>
        </Col>
        <Col span="3">
          <FormItem :label="index === 0? '生产数量' : ''" style="width: 100%">
            <Input v-model="batch.num" readonly/>
          </FormItem>
        </Col>
        <Col span="3">
          <FormItem :label="index === 0? '剩余可入库量' : ''" style="width: 100%">
            <Input v-model="batch.remainNum" readonly/>
          </FormItem>
        </Col>
        <Col span="3" v-show="isManualStorage">
          <FormItem :label="index === 0? '本次入库数量' : ''" style="width: 100%" :prop="'batchData.' + index + '.currentQuantity'" :rules="rules.currentQuantity">
<!--            <Input v-model="batch.currentQuantity"/>-->
            <InputNumber style="width: 100%;" :min="0" v-model="batch.currentQuantity"/>
          </FormItem>
        </Col>
        <Col span="3" v-show="!isManualStorage">
          <FormItem :label="index === 0? '已实际入库量' : ''" style="width: 100%">
            <Input v-model="batch.currentQuantity"/>
          </FormItem>
        </Col>
        <Col span="3" v-show="!isManualStorage">
          <FormItem :label="index === 0? '修改本次入库数量' : ''" style="width: 100%">
            <Input v-model="batch.currentQuantity"/>
          </FormItem>
        </Col>
        <Col span="3" v-if="isManualStorage">
          <FormItem :label="index === 0? ' ' : ''" :class="index === 0 ? 'endNumStyle' : ''">
            <Button shape="circle" icon="md-add" v-if="index === 0" @click="addBatchData"></Button>
            <Button shape="circle" icon="md-remove" v-else style="margin-left: 12px"></Button>
          </FormItem>
        </Col>
      </Row>

      <!--        TODO: 修改是隐藏-->
      <Row class="margin-top-10" v-if="isManualStorage">
        <Col span="2" offset="16"  style=" text-align: right; padding-top: 10px"> 总计 </Col>
        <Col span="3"><Input v-model="actualNumberTotal" readonly/></Col>
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
        spinShow: false,
        submitLoading: false,
        subTitle: '手动入库',
        fileUploadURL: `${SERVER_BASE_URL}traceability/traceability/upload`,
        fileUploadHeaders: {
          Authorization: Cookies.get('authorization')
        },
        userInfo: {},
        batchList: [],
        form: {
          id: null,
          boxItems: [],
          batchData: [
            {
              num: null,
              mark_type: '',
              plan_name: '',
              remainNum: null,
              batchNumber: null,
              currentQuantity: null,
              options: []
            }
          ],
        },
        detailData: {
          expected_quantity: null
        },
        rules: {
          batchNumber: [{required: true, message: '必填项', trigger: 'change'}],
          currentQuantity: [{required: true, type: 'number', message: '必填项', trigger: 'change'}],
        },
        numberByapplyId: null,
      }
    },
    methods: {

      toStorageRecord() {
        this.$router.push({
          name: 'storage-management/storage-application',
          params: {
            tab: 'record',
            supplierOrderNumber: this.detailData.supplier_order_number
          }
        })
      },

      beforeUpload(file) {
        const check = /.txt$/.test(file.name)
        // this.$Message.info('正在上传')
        if (check) {
          this.$Message.warning('请不要上传txt格式的文件')
        }
        return !check;
      },
      onsuccess(response) {
        if (response.code === 0) {
          this.$Message.success(response.msg)
          this.form.boxItems.push(response.data.fileUploadVo)
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

      remoteMethod(query, index) {
        if(!query) return
          this.$API.getProductionBatch({batchNumber: query, page: 1, perPage: 1000}).then(res => {
          if(res.code !== 0) return
          let {list} = res.data
          this.form.batchData[index].options = list.map(items => {
            items.label = items.batch_number
            items.value = items.batch_number
            return items
          })
        })
      },

      batchNumberChange(batchNumber, index) {
        if(!batchNumber) {
          this.form.batchData[index].num = null
          this.form.batchData[index].mark_type = ''
          this.form.batchData[index].plan_name = ''
          this.form.batchData[index].remainNum = null
          return
        }
        console.log(768)
        this.$API.getProductionBatch({batchNumber, page: 1, perPage: 1000}).then(res => {
          if(res.code !== 0) return
          let {list} = res.data
          this.form.batchData[index].num = list[0].num
          this.form.batchData[index].mark_type = !list[0].mark_type ? '-' : list[0].mark_type === 'P' ? '平标' : '卷标'
          this.form.batchData[index].plan_name = list[0].plan_name

          this.$API.getStorageBatchNumber({batchNumber}).then(res => {
            if(res.code !== 0) return
            // console.log(this.form.batchData[index].remainNum, this.form.batchData[index].num - res.data[0])
            this.form.batchData[index].remainNum = this.form.batchData[index].num - res.data[0]
          })
        })


      },

      addBatchData() {
        this.form.batchData.push({
          num: null,
          mark_type: '',
          plan_name: '',
          remainNum: null,
          batchNumber: null,
          currentQuantity: null,
          options: []
        })
      },

      submit() {
        let params = JSON.parse(JSON.stringify(this.form))
        // this.submitLoading = true
        if(this.applyId){
          if(params.boxItems.length === 0) return this.$Message.warning('请上传装箱单')
          params.batchData = params.batchData.map(items => {
            return {
              batchNumber: items.batchNumber,
              currentQuantity: items.currentQuantity,
            }
          })
          console.log(this.form)
          console.log(params, 'params')
          this.$API.manualStotageApply(params).then(res => {
            console.log(res)
            if(res.code !==0) return
            this.submitLoading = false
            this.$Message.success(res.msg)
            this.$router.push('/storage-management/storage-application')
          })
        }else {

        }

      },

      // 获取申请详情
      getDetail(id) {
        return this.$API.getStorageDetail(id).then(res => {
          if (res.code === 0) {
            let data = res.data
            this.form.boxItems = data.box_file
            this.detailData = data
            this.detailData.delivery_file = data.delivery_file
          }
          return res.code
        })
      },

      // 获取记录详情
      getRecordDetail(id) {
        // this.spinShow = true
        return this.$API.getStorageRecordDetail(id).then(res => {
          if (res.code === 0) {
            let data = res.data
            this.detailData = {
              created_by: data.createdBy,
              created_at: data.createdAt,
              storage_number: data.storageNumber,
              supplier_order_number: data.supplierOrderNumber,
              amount: data.amount,
              expected_quantity: data.expectedQuantity,
              order_time: data.orderTime,
              supplier: data.supplier,
              packing: data.packing,
              packing_type: data.packingType,
              position_number: data.positionNumber,
              remark: data.remark,
              delivery_file: data.fileItems
            }
            this.form.boxItems = data.boxItems
          }
          return res.code
        })
      },

      // 获取记录数据
      getStorageRecordById(id) {
        return this.$API.getStorageRecordByIds({ids: [id]}).then(res => {
          if (res.code === 0) {
            let data = res.data
            this.detailData = {
              created_by: data.createdBy,
              created_at: data.createdAt,
              storage_number: data.storageNumber,
              supplier_order_number: data.supplierOrderNumber,
              amount: data.amount,
              expected_quantity: data.expectedQuantity,
              order_time: data.orderTime,
              supplier: data.supplier,
              packing: data.packing,
              packing_type: data.packingType,
              position_number: data.positionNumber,
              remark: data.remark,
            }
            this.detailData.delivery_file = [data.fileItems]
          }
          return res.code
        })
      },

      // 通过入库申请id获取入库数量(待确认+已确认)
      getNumberByApplyId(id) {
        // this.spinShow = true
        return this.$API.getNumberByApplyId(id).then(res => {
          if (res.code !== 0) {
            this.numberByapplyId = res.data[0]
          }
          return res.code
        })
      }
    },
    mounted() {
      this.userInfo = JSON.parse(window.localStorage.getItem('userInfo'))
      this.applyId = this.$route.query.applyId
      this.recordId = this.$route.query.recordId

      this.spinShow = true

      if(this.$route.query.recordId) {
        console.log('修改入库记录')
        this.subTitle = '修改入库记录'
        this.form.id = this.recordId
        this.getRecordDetail(this.recordId).then(() => {
          return this.getStorageRecordById(this.recordId)
        }).then(code => {
          code === 0 && (this.spinShow = false)
        })

      }else {
        console.log('手动入库')
        this.form.id = this.applyId
        this.getDetail(this.applyId).then(() => {
          return this.getNumberByApplyId(this.applyId)
        }).then(code => {
          code === 0 && (this.spinShow = false)
        })
      }
    },
    computed: {
      // 实际点货量汇总
      actualNumberTotal() {
        // 汇总每个序列号实际点货量
        let batchData = this.form.batchData
        let total = batchData.reduce((pre, cur) => {
          let currentQuantity = cur.currentQuantity || 0
          return Number(pre) + Number(currentQuantity)
        }, 0)
        // console.log(total)
        return total
      },

      isManualStorage() {
        return this.subTitle === '手动入库'
      },

      remainNumber() {
        // 剩余可入库 < 入库记录待确认 + 已确认 TODO: 接口待定
        return this.detailData.expected_quantity - this.numberByapplyId
      }

    },

  }
</script>

<style scoped>
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

  .upload-list:hover, .serialdata:hover {
    background-color: #f3f3f3;
  }

  .upload-list .download-link {
    display: block;
    flex: 1;
  }

  .upload-list .icon-trash {
    visibility: hidden;
  }

  .upload-list:hover .icon-trash {
    visibility: visible;
    cursor: pointer;
  }

  .endNumStyle {
    width: 100%;
    padding-top: 34px;
  }

</style>