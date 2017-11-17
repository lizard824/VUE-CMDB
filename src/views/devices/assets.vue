<template>
  <div class="app-container">
    <div style="float: right; margin:20px">
      <el-button type="primary" icon="search" @click="dialogSearchVisible=true">搜索</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="edit">添加</el-button>
      <el-button class="filter-item" type="primary" icon="document" @click="handleDownload">导出</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="dialogMultiVisible=true" type="primary" icon="edit">批量修改</el-button>
    </div>

    <el-table
      :data="list"
      v-loading="listLoading"
      element-loading-text="need some time"
      border fit highlight-current-row
      style="width: 100%"
      @selection-change="handleSelectionChange">
      <el-table-column type="expand">
        <template scope="scope">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="配置">
              <span>{{ scope.row.config }}</span>
            </el-form-item>
            <el-form-item label="购买时间">
              <span>{{ scope.row.buy_time }}</span>
            </el-form-item>
            <el-form-item label="续保时间">
              <span>{{ scope.row.Renewal_first }}</span>
            </el-form-item>
            <el-form-item label="续保过期">
              <span>{{ scope.row.Renewal_expiration }}</span>
            </el-form-item>
            <el-form-item label="修改者">
              <span>{{ scope.row.last_editor }}</span>
            </el-form-item>
            <el-form-item label="创建日期">
              <span>{{ scope.row.create_date }}</span>
            </el-form-item>
            <el-form-item label="更新日期">
              <span>{{ scope.row.update_date }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column
        type="selection"
        width="35">
      </el-table-column>

      <!--<el-table-column-->
        <!--label="id"-->
        <!--prop="device_id" sortable>-->
      <!--</el-table-column>-->
      <el-table-column
        label="SN"
        prop="sn" sortable>
      </el-table-column>
      <el-table-column
        label="服务码"
        prop="code" sortable>
      </el-table-column>
      <el-table-column
        label="老虎资产"
        prop="lhzq_sn" sortable>
      </el-table-column>
      <el-table-column
        label="设备类别"
        prop="asset_type" sortable>
      </el-table-column>
      <el-table-column
        label="厂商"
        prop="oem" sortable>
      </el-table-column>
      <el-table-column
        label="型号"
        prop="model" sortable>
      </el-table-column>
      <el-table-column
        label="机房"
        prop="isp">
      </el-table-column>
      <el-table-column
        label="城市"
        prop="city">
      </el-table-column>
      <el-table-column
        label="位置"
        prop="position">
      </el-table-column>

      <el-table-column
        label="机柜"
        prop="name">
      </el-table-column>

      <el-table-column
        label="外网地址"
        prop="ip1">
      </el-table-column>

      <el-table-column
        label="内网地址"
        prop="ip2">
      </el-table-column>

      <el-table-column
        label="管理地址"
        prop="ip3">
      </el-table-column>

      <el-table-column
        label="状态"
        prop="status">
        <template scope="scope">
          {{scope.row.status | deviceV }}
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
                     :page-sizes="[10,20,30, 50]" :page-size="listQuery.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <!--新增-->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogNewVisible">
      <el-form :model="ctemp" status-icon :rules="rules" ref="temp" label-width="100px" class="demo-ruleForm">

        <el-form-item label="SN" :label-width="formLabelWidth" prop="sn">
          <el-input v-model="ctemp.sn" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="服务码" :label-width="formLabelWidth" prop="code">
          <el-input v-model="ctemp.code" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="老虎资产" :label-width="formLabelWidth" prop="lhza_sn">
          <el-input v-model="ctemp.lhzq_sn" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="设备类型" :label-width="formLabelWidth" prop="asset_type">
          <el-input v-model="ctemp.asset_type" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="厂商" :label-width="formLabelWidth" prop="oem" >
          <el-input v-model="ctemp.oem" auto-complete="off" ></el-input>
        </el-form-item>
        <el-form-item label="型号" :label-width="formLabelWidth" prop="model" >
          <el-input v-model="ctemp.model" auto-complete="off" ></el-input>
        </el-form-item>
        <el-form-item label="机房" :label-width="formLabelWidth" prop="isp" >
          <el-input v-model="ctemp.isp" auto-complete="off" ></el-input>
        </el-form-item>
        <el-form-item label="机柜" :label-width="formLabelWidth" prop="name" >
          <el-input v-model="ctemp.name" auto-complete="off" ></el-input>
        </el-form-item>
        <el-form-item label="外网地址" :label-width="formLabelWidth" prop="ip1" >
          <el-input v-model="ctemp.ip1" auto-complete="off" ></el-input>
        </el-form-item>
        <el-form-item label="内网地址" :label-width="formLabelWidth" prop="ip2" >
          <el-input v-model="ctemp.ip2" auto-complete="off" ></el-input>
        </el-form-item>
        <el-form-item label="管理地址" :label-width="formLabelWidth" prop="ip3" >
          <el-input v-model="ctemp.ip3" auto-complete="off" ></el-input>
        </el-form-item>
        <el-form-item label="状态" :label-width="formLabelWidth" prop="status">
          <el-select v-model="ctemp.status" placeholder="请选择状态">
            <el-option label="正常" value=0></el-option>
            <el-option label="故障" value=1></el-option>
            <el-option label="下架" value=2></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="配置" :label-width="formLabelWidth" prop="config" >
          <el-input v-model="temp.config" auto-complete="off" ></el-input>
        </el-form-item>
        <el-form-item label="购买时间" :label-width="formLabelWidth" prop="buy_time" >
          <el-input v-model="temp.buy_time" auto-complete="off" ></el-input>
        </el-form-item>
        <el-form-item label="续保时间" :label-width="formLabelWidth" prop="Renewal_first" >
          <el-input v-model="temp.Renewal_first" auto-complete="off" ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogNewVisible = false">取 消</el-button>
        <el-button type="primary" @click="create">确 定</el-button>
      </div>
    </el-dialog>
    <!--editdialog-->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :model="temp" status-icon :rules="rules" ref="temp" label-width="100px" class="demo-ruleForm">

        <el-form-item label="SN" :label-width="formLabelWidth" prop="sn">
          <el-input v-model="temp.sn" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="服务码" :label-width="formLabelWidth" prop="code">
          <el-input v-model="temp.code" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="老虎资产" :label-width="formLabelWidth" prop="lhza_sn">
          <el-input v-model="temp.lhzq_sn" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="设备类型" :label-width="formLabelWidth" prop="asset_type">
          <el-input v-model="temp.asset_type" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="厂商" :label-width="formLabelWidth" prop="oem" >
          <el-input v-model="temp.oem" auto-complete="off" ></el-input>
        </el-form-item>
        <el-form-item label="型号" :label-width="formLabelWidth" prop="model" >
          <el-input v-model="temp.model" auto-complete="off" ></el-input>
        </el-form-item>
        <el-form-item label="机房" :label-width="formLabelWidth" prop="isp" >
          <el-input v-model="temp.isp" auto-complete="off" ></el-input>
        </el-form-item>
        <el-form-item label="机柜" :label-width="formLabelWidth" prop="name" >
          <el-input v-model="temp.name" auto-complete="off" ></el-input>
        </el-form-item>
        <el-form-item label="外网地址" :label-width="formLabelWidth" prop="ip1" >
          <el-input v-model="temp.ip1" auto-complete="off" ></el-input>
        </el-form-item>
        <el-form-item label="内网地址" :label-width="formLabelWidth" prop="ip2" >
          <el-input v-model="temp.ip2" auto-complete="off" ></el-input>
        </el-form-item>
        <el-form-item label="管理地址" :label-width="formLabelWidth" prop="ip3" >
          <el-input v-model="temp.ip3" auto-complete="off" ></el-input>
        </el-form-item>
        <el-form-item label="状态" :label-width="formLabelWidth" prop="status">
          <el-select v-model="temp.status" placeholder="请选择状态">
            <el-option label="正常" value=0></el-option>
            <el-option label="故障" value=1></el-option>
            <el-option label="下架" value=2></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="配置" :label-width="formLabelWidth" prop="config" >
          <el-input v-model="temp.config" auto-complete="off" ></el-input>
        </el-form-item>
        <el-form-item label="购买时间" :label-width="formLabelWidth" prop="buy_time" >
          <el-input v-model="temp.buy_time" auto-complete="off" ></el-input>
        </el-form-item>
        <el-form-item label="续保时间" :label-width="formLabelWidth" prop="Renewal_first" >
          <el-input v-model="temp.Renewal_first" auto-complete="off" ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="update">确 定</el-button>
      </div>
    </el-dialog>
    <!--批量-->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogMultiVisible">
      <el-form :model="temp" status-icon :rules="rules" ref="temp" label-width="100px" class="demo-ruleForm">

        <el-form-item label="SN" :label-width="formLabelWidth" prop="sn">
          <el-input v-model="temp.sn" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="服务码" :label-width="formLabelWidth" prop="code">
          <el-input v-model="temp.code" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="老虎资产" :label-width="formLabelWidth" prop="lhza_sn">
          <el-input v-model="temp.lhzq_sn" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="设备类型" :label-width="formLabelWidth" prop="asset_type">
          <el-input v-model="temp.asset_type" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="厂商" :label-width="formLabelWidth" prop="oem" >
          <el-input v-model="temp.oem" auto-complete="off" ></el-input>
        </el-form-item>
        <el-form-item label="型号" :label-width="formLabelWidth" prop="model" >
          <el-input v-model="temp.model" auto-complete="off" ></el-input>
        </el-form-item>
        <el-form-item label="机房" :label-width="formLabelWidth" prop="isp" >
          <el-input v-model="temp.isp" auto-complete="off" ></el-input>
        </el-form-item>
        <el-form-item label="机柜" :label-width="formLabelWidth" prop="name" >
          <el-input v-model="temp.name" auto-complete="off" ></el-input>
        </el-form-item>
        <el-form-item label="外网地址" :label-width="formLabelWidth" prop="ip1" >
          <el-input v-model="temp.ip1" auto-complete="off" ></el-input>
        </el-form-item>
        <el-form-item label="内网地址" :label-width="formLabelWidth" prop="ip2" >
          <el-input v-model="temp.ip2" auto-complete="off" ></el-input>
        </el-form-item>
        <el-form-item label="管理地址" :label-width="formLabelWidth" prop="ip3" >
          <el-input v-model="temp.ip3" auto-complete="off" ></el-input>
        </el-form-item>
        <el-form-item label="状态" :label-width="formLabelWidth" prop="status">
          <el-select v-model="temp.status" placeholder="请选择状态">
            <el-option label="正常" value=0></el-option>
            <el-option label="故障" value=1></el-option>
            <el-option label="下架" value=2></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="配置" :label-width="formLabelWidth" prop="config" >
          <el-input v-model="temp.config" auto-complete="off" ></el-input>
        </el-form-item>
        <el-form-item label="购买时间" :label-width="formLabelWidth" prop="buy_time" >
          <el-input v-model="temp.buy_time" auto-complete="off" ></el-input>
        </el-form-item>
        <el-form-item label="续保时间" :label-width="formLabelWidth" prop="Renewal_first" >
          <el-input v-model="temp.Renewal_first" auto-complete="off" ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogMultiVisible = false">取 消</el-button>
        <el-button type="primary" @click="MultiUpdate">确 定</el-button>
      </div>
    </el-dialog>
    <!--复合搜索-->
    <el-dialog title="搜索" :visible.sync="dialogSearchVisible">
      <el-form :model="listQuery" status-icon :rules="rules" ref="listQuery" label-width="100px" class="demo-ruleForm">
        <el-form-item label="城市" :label-width="formLabelWidth" prop="city">
        <el-input v-model="listQuery.city" auto-complete="off"></el-input>
      </el-form-item>
        <el-form-item label="服务码" :label-width="formLabelWidth" prop="code">
          <el-input v-model="listQuery.code" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="续保时间" :label-width="formLabelWidth" prop="Renewal_first">
          <el-input v-model="listQuery.Renewal_first" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="续保过期" :label-width="formLabelWidth" prop="Renewal_expiration">
          <el-input v-model="listQuery.Renewal_expiration" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="配置" :label-width="formLabelWidth" prop="config" >
          <el-input v-model="listQuery.config" auto-complete="off" ></el-input>
        </el-form-item>
        <el-form-item label="状态" :label-width="formLabelWidth" prop="status">
          <el-select v-model="listQuery.status" placeholder="请选择状态">
            <el-option label="正常" value=0></el-option>
            <el-option label="故障" value=1></el-option>
            <el-option label="下架" value=2></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="外网地址" :label-width="formLabelWidth" prop="ip1" >
          <el-input v-model="listQuery.ip1" auto-complete="off" ></el-input>
        </el-form-item>
        <el-form-item label="内网地址" :label-width="formLabelWidth" prop="ip2" >
          <el-input v-model="listQuery.ip2" auto-complete="off" ></el-input>
        </el-form-item>
        <el-form-item label="管理地址" :label-width="formLabelWidth" prop="ip3" >
          <el-input v-model="listQuery.ip3" auto-complete="off" ></el-input>
        </el-form-item>
        <el-form-item label="厂商" :label-width="formLabelWidth" prop="oem" >
          <el-input v-model="listQuery.oem" auto-complete="off" ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogSearchVisible = false">退出</el-button>
        <el-button type="primary" @click="handleIconClick">搜索</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<style scoped>
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }



</style>

<script>
  import axios from 'axios'
  import {parseTime} from '@/utils'

  export default {

    data() {
      var selectList = new Set();
      var reg=/^(\d{1,3})(\.(\d{1,3})){3}$/
      var checkEmpty = (rule, value, callback) => {
        console.log(value)
        if (!value) {
          return callback(new Error('输入不能为空'))
        }
        else{
          callback()
        }
      }
      var checkAddress = (rule, value, callback) =>{

        if (!value) {
          return callback(new Error('输入不能为空'))
        }
        if(!reg.test(value)){
          callback(new Error('请填写正确的ip地址'))
        }else{
          callback()
        }

      }
      return {
        formLabelWidth: '120px',
        list: null,
        total: null,
        listLoading: true,
        defalutQuery:{
          page: 1,
          pagesize: 20
        },
        listQuery: {
          code: null,
          city: null,
          create_date: null,
          Renewal_first:null,
          Renewal_expiration:null,
          expiration_time:null,
          config:null,
          status:null,
          update_date:null,
          ip2:null,
          ip1:null,
          ip3:null,
          oem:null,
          last_editor:null,
          asset_type:null,
          device_id:null,
          name:null,
          buy_time:null,
          isp:null,
          lhzq_sn:null,
          sn:null,
          position:null,
          model:null,
          page: 1,
          pagesize: 20

        },
        //edit temp
        temp: {
          code: null,
          city: null,
          create_date: null,
          Renewal_first:null,
          Renewal_expiration:null,
          expiration_time:null,
          config:null,
          status:null,

          ip2:null,
          ip1:null,
          ip3:null,
          oem:null,

          asset_type:null,
          device_id:null,
          name:null,
          buy_time:null,
          isp:null,
          lhzq_sn:null,
          sn:null,
          position:null,
          model:null,
        },
        //create temp without idc_id
        ctemp: {
          code: null,
          city: null,

          Renewal_first:null,
          Renewal_expiration:null,
          expiration_time:null,
          config:null,
          status:null,

          ip2:null,
          ip1:null,
          ip3:null,
          oem:null,
          last_editor:null,
          asset_type:null,

          name:null,
          buy_time:null,
          isp:null,
          lhzq_sn:null,
          sn:null,
          position:null,
          model:null,
        },
        textMap: {
          edit: 'Edit',
          create: 'Create',
          MultiEdit: 'Multi Edit'

        },
        dialogNewVisible: false,
        dialogFormVisible: false,
        dialogMultiVisible: false,
        dialogSearchVisible: false,
        dialogStatus: '',
        multipleSelection: [],
        //use to transfer single idc_id to list [x]
        transferSelect: [],
        setList: selectList,

        rules: {
          ip1: [{validator: checkAddress, trigger: 'blur'}],
          ip2: [{validator: checkAddress, trigger: 'blur'}],
          ip3: [{validator: checkAddress, trigger: 'blur'}],
          code:[{validator: checkEmpty, tirgger:'blur'}],
          city:[{validator:checkEmpty,tirgger:'blur'}]

        }

      }
    },
    created() {
      this.getList()
      console.log('geting list..')
    },
    computed:{
      filterMessage: {

        get:function () {
          return this.temp.status
        },
        set:function (val) {

          if (val==0){
            this.temp.status = '正常'
          }
          if (val==1){
            this.temp.status ='故障'
          }
          if (val==2){
            this.temp.status = '下架'
          }
        }


      }
    },
    methods:{
      getList(){
        this.listLoading = true
        axios.get('http://cmdb.tigerbrokers.net:8000/devices/getAllDevices',{params:this.listQuery}).then(response=>{
          console.log(response.data);
          this.list = response.data.data
          console.log(this.list)
          this.total = response.data.total[0].total
          this.listLoading = false
        }).catch((err)=> {
          console.log(err)
        })


      },
      handleIconClick() {
        this.listQuery.page=1
        search(this.listQuery).then(response=>{
          this.list = response.data
        }).catch((err)=>{

        })

      },
      handleSizeChange(val) {
        this.listQuery.pagesize = val
        this.getList()
      },
      handleCurrentChange(val) {
        this.listQuery.page = val
        this.getList()
      },
      handleEdit(index,row){
        var date = new Date()
        this.dialogStatus = 'edit'
        console.log(row)
        this.temp = Object.assign({}, row)
        this.filterMessage = this.temp.status
        this.transferSelect.splice(0,1,row.device_id)
        this.temp.device_id = this.transferSelect
        console.log(this.$store.getters.name)
        this.temp.last_editor = this.$store.getters.name
        this.temp.update_date = this.transferDate(date)
        console.log(this.temp)
        this.dialogFormVisible = true
      },
      handleDelete(index,row){
        console.log(row)
        axios.post('http://cmdb.tigerbrokers.net:8000/devices/deleteDevice', {device_id: [row.device_id]}).then(response => {
          console.log(response.data);
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000

          })
          const index = this.list.indexOf(row)
          this.list.splice(index, 1)
        }).catch(error => {
        })
      },
      handleCreate(){
        var date = new Date()
        this.dialogStatus = 'create'
        this.dialogNewVisible = true
        var time = this.transferDate(date)
        this.ctemp.create_date = time
        this.ctemp.update_date = time

        this.ctemp.last_editor = this.$store.getters.name
        console.log(this.ctemp)
      },
      handleDownload() {
        require.ensure([], () => {
          const { export_json_to_excel } = require('@/vendor/Export2Excel')
          const tHeader = ['时间', '地区', '类型', '标题', '重要性']
          const filterVal = ['timestamp', 'province', 'type', 'title', 'importance']
          const data = this.formatJson(filterVal, this.list)
          export_json_to_excel(tHeader, data, 'table数据')
        })
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => {
          if (j === 'timestamp') {
            return parseTime(v[j])
          } else {
            return v[j]
          }
        }))
      },
      transferDate(date) {
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        m = m < 10 ? ('0' + m) : m;
        var d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        var h = date.getHours();
        var minute = date.getMinutes();
        minute = minute < 10 ? ('0' + minute) : minute;
        return y + '-' + m + '-' + d + ' ' + h + ':' + minute;
      },
      //temp value of multiple selection
      handleSelectionChange(val) {
        this.setList = val
        console.log(this.setList)
        this.temp = Object.assign({}, val[0])
        this.setList.forEach((item, i) => {

          this.multipleSelection.push(item.device_id);

        })
      },
      update(){
        axios.post('http://cmdb.tigerbrokers.net:8000/devices/editDevice', this.temp).then(response => {
          console.log(response)
          this.dialogFormVisible = false
          this.$notify({
            title: '成功',
            message: '修改成功',
            type: 'success',
            duration: 2000
          })
          this.getList()
        }).catch(function (error) {
          console.log(error)
        })
      },
      //批量修改
      MultiUpdate() {
        var date = new Date()
        this.dialogStatus = 'MultiEdit'


        this.dialogMultiVisible = true

        this.temp.update_date = this.transferDate(date)
        this.temp.idc_id = this.multipleSelection

        console.log(this.temp)
        axios.post('http://cmdb.tigerbrokers.net:8000/devices/editDevices', this.temp).then(response => {
          console.log(response.data);
          this.$notify({
            title: '成功',
            message: '修改成功',
            type: 'success',
            duration: 2000
          })
          this.dialogMultiVisible = false
          this.getList()
        }).catch(error => {
          console.log(error)
        })
      },
      //新建
      create() {
        this.$refs.ctemp.validate((valid)=>{
          if(valid){

            axios.post('http://cmdb.tigerbrokers.net:8000/devices/addDevice', this.ctemp
            ).then(response => {
              console.log(response)
              this.dialogNewVisible = false
              this.$notify({
                title: '成功',
                message: '增加成功',
                type: 'success',
                duration: 2000
              })
              this.getList()
            }).catch(function (error) {
              console.log(error)
            })
          }else{
            alert('Can not submit')
          }
        })


      },

    }
  }
</script>
