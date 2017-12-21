<template>
  <div class="app-container">
    <div style="float: right; margin:20px">
      <el-button type="primary" icon="search" @click="dialogSearchVisible=true" v-if="this.$store.getters.perms.indexOf('32r')>-1  || this.$store.getters.perms.indexOf('5')>-1 ">搜索</el-button>
      <el-button class="filter-item" type="primary" icon="document" @click="handleDownload" v-if="this.$store.getters.perms.indexOf('32l')>-1  || this.$store.getters.perms.indexOf('5')>-1 ">导出</el-button>
    </div>

    <el-table
      :data="list"
      v-loading="listLoading"
      element-loading-text="need some time"
      border fit highlight-current-row
      style="width: 100%"
      >

      <!--<el-table-column-->
        <!--label="ID"-->
        <!--prop="ip_id" sortable>-->
      <!--</el-table-column>-->
      <el-table-column
        label="IP"
        prop="ip" sortable>
      </el-table-column>
      <el-table-column
        label="掩码"
        prop="netmask" sortable>
      </el-table-column>
      <el-table-column
        label="网关"
        prop="gateway" sortable>
      </el-table-column>
      <el-table-column
        label="运营商"
        prop="isp" sortable>
      </el-table-column>
      <el-table-column
        label="城市"
        prop="city" sortable>
      </el-table-column>
      <el-table-column
        label="位置"
        prop="position" sortable>
      </el-table-column>
      <el-table-column
        label="状态"
        prop="status" sortable>
        <template scope="scope">
          {{scope.row.status | ipV}}
        </template>
      </el-table-column>
      <el-table-column
        label="修改者"
        prop="last_editor">
      </el-table-column>
      <el-table-column
        label="创建日期"
        prop="create_date">
      </el-table-column>
      <el-table-column
        label="更新日期"
        prop="update_date">
      </el-table-column>

      <el-table-column label="操作">
        <template scope="scope">
          <el-button v-if="perms.indexOf('32u')>-1 || perms.indexOf('5')>-1 "
            size="mini"
            @click="handleEdit(scope.$index, scope.row)">编辑</el-button>

        </template>
      </el-table-column>
    </el-table>

    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
                     :page-sizes="[10,20,30, 50]" :page-size="listQuery.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <!--&lt;!&ndash;edit, create dialog&ndash;&gt;-->
    <!--<el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">-->
      <!--<el-form :model="temp">-->
        <!--<el-form-item label="oem" :label-width="formLabelWidth">-->
          <!--<el-input v-model="temp.oem" auto-complete="off"></el-input>
        <!--</el-form-item>-->
        <!--<el-form-item label="idc" :label-width="formLabelWidth">-->
          <!--<el-input v-model="temp.idc" auto-complete="off"></el-input>-->
        <!--</el-form-item>-->
      <!--</el-form>-->
      <!--<div slot="footer" class="dialog-footer">-->
        <!--<el-button @click="dialogFormVisible = false">取 消</el-button>-->
        <!--<el-button type="primary" @click="dialogFormVisible=false">确 定</el-button>-->
      <!--</div>-->
    <!--</el-dialog>-->

    <!--<el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogMultiVisible">-->
      <!--<el-form :model="temp">-->
        <!--<el-form-item label="oem" :label-width="formLabelWidth">-->
          <!--<el-input v-model="temp.oem" auto-complete="off"></el-input>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="idc" :label-width="formLabelWidth">-->
          <!--<el-input v-model="temp.idc" auto-complete="off"></el-input>-->
        <!--</el-form-item>-->
      <!--</el-form>-->
      <!--<div slot="footer" class="dialog-footer">-->
        <!--<el-button @click="dialogFormVisible = false">取 消</el-button>-->
        <!--<el-button type="primary" @click="update">确 定</el-button>-->

      <!--</div>-->
    <!--</el-dialog>-->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :model="temp">
        <el-form-item label="状态" :label-width="formLabelWidth" prop="status">

          <el-select v-model="temp.status" placeholder="请选择">
            <el-option label="已分配" value=0></el-option>
            <el-option label="系统占用" value=1></el-option>
            <el-option label="未占用" value=2></el-option>
          </el-select>

        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="update">确 定</el-button>
      </div>
    </el-dialog>
    <!--复合搜索-->
    <el-dialog title="搜索" :visible.sync="dialogSearchVisible">
      <el-form :model="listQuery" status-icon  ref="ctemp" label-width="100px" class="demo-ruleForm">
        <el-form-item label="ip" :label-width="formLabelWidth" prop="ip_segment">
          <el-input v-model="listQuery.ip" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="掩码" :label-width="formLabelWidth" prop="netmask">
          <el-input v-model="listQuery.netmask" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="网关" :label-width="formLabelWidth" prop="gateway">
          <el-input v-model="listQuery.gateway" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="运营商" :label-width="formLabelWidth" prop="gateway">
          <el-input v-model="listQuery.isp" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="城市" :label-width="formLabelWidth" prop="gateway">
          <el-input v-model="listQuery.city" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="位置" :label-width="formLabelWidth" prop="gateway">
          <el-input v-model="listQuery.position" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="状态" :label-width="formLabelWidth" prop="status">
          <el-select v-model="listQuery.status" placeholder="请选择状态">
            <el-option label="已分配" value=0></el-option>
            <el-option label="系统占用" value=1></el-option>
            <el-option label="未占用" value=2></el-option>
          </el-select>
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
      var checkEmpty = (rule, value, callback) => {
        console.log(value)
        if (!value) {
          return callback(new Error('输入不能为空'))
        }else{
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
        listQuery: {

          status:"",
          city:"",
          create_date:"",
          gateway:"",
          ip:"",
          isp:"",
          last_editor:"",
          netmask:"",
          position:"",
          status:"",
          update_date:"",

          page:1,
          pagesize: 20,

        },
        temp:{
          ip_id:"",
          status:"",
          city:"",
          create_date:"",
          gateway:"",
          ip:"",
          isp:"",
          last_editor:"",
          netmask:"",
          position:"",
          status:"",
          update_date:""


        },
        textMap: {
          edit: 'Edit',
          create: 'Create',
          MultiEdit:'Multi Edit'

        },
        dialogFormVisible: false,
        dialogMultiVisible:false,
        dialogSearchVisible:false,
        dialogStatus: '',
        transferSelect: [],
        multipleSelection: selectList
//        rules: {
//          ip_segment: [{validator: checkAddress, trigger: 'blur'}],
//          netmask: [{validator: checkAddress, trigger: 'blur'}],
//          gateway: [{validator: checkAddress, trigger: 'blur'}],
//          isp:[{validator: checkEmpty, trigger:'blur'}],
//          city:[{validator:checkEmpty,trigger:'blur'}]
//
//        }

      }
    },
    created() {
      this.getList()
      console.log('geting list..')
    },
    mounted() {

      var dialog = document.querySelectorAll('div.el-dialog')
      dialog.forEach(function (value,index,array) {
        value.onmousedown = function(ev) {
          var oevent = ev || event;

          var distanceX = oevent.clientX - value.offsetLeft;
          var distanceY = oevent.clientY - value.offsetTop;

          document.onmousemove = function (ev) {
            var oevent = ev || event;
            value.style.left = oevent.clientX - distanceX + 'px';
            value.style.top = oevent.clientY - distanceY + 'px';
          };
          document.onmouseup = function () {
            document.onmousemove = null;
            document.onmouseup = null;
          };
        }
      })


    },
    computed:{
      filterMessage: {

        get:function () {
            return this.temp.status
        },
        set:function (val) {

          if (val==0){
            this.temp.status = '已分配'
          }
          if (val==1){
            this.temp.status ='系统占用'
          }
          if (val==2){
            this.temp.status = '未占用'
          }
        }


      },
      reverseMessage:{
        get:function(){
          return this.temp.status
          console.log(this.temp.status)
        },
        set:function(val){
          console.log(val)
          if(val.indexOf('已分配')>-1){
            this.temp.status= 0
            console.log(11111)
          }
          if(val.indexOf('系统占用')>-1){
            this.temp.status = 1
          }
          if(val.indexOf('未占用')>-1){
            this.temp.status = 2
          }
        }
      },
      perms(){
        return this.$store.getters.perms
      }
    },
    methods:{
      getList(){
        this.listLoading = true
        axios.get('http://cmdb.tigerbrokers.net:8000/ip/getAll',{params:this.listQuery}).then(response=>{
          console.log(response.data);
          this.list = response.data.data
          console.log(response.data.total)
          this.total = response.data.total[0].total
          this.listLoading = false
        }).catch((err)=> {
          console.log(err)
        })


      },
      handleIconClick() {
        console.log(Object.keys(this.listQuery))
        this.dialogSearchVisible = false
        this.listLoading =  true
        axios.post('http://cmdb.tigerbrokers.net:8000/ip/searchIp',this.listQuery).then(response => {
          console.log(response.data);
          this.list = response.data.data
          console.log(response.data.total)
          this.total = response.data.total[0].total
          this.listLoading = false
          if(response.data.code=='20000'){
            this.$notify({
              title: '成功',
              message: response.data.msg,
              type: 'success',
              duration: 5000
            })
          }else{
            this.$notify({
              title: '失败',
              message: response.data.msg,
              type: 'warning',
              duration: 5000
            })
          }
          this.$refs.listQuery.resetFields()
        }).catch((err) => {
          console.log(err)
          this.listLoading =  false
        })

      },
      handleSizeChange(val) {
        this.listQuery.pagesize = val
        if(Object.keys(this.listQuery).length>2){
          axios.post('http://cmdb.tigerbrokers.net:8000/ip/searchIp',this.listQuery).then(response => {
            console.log(response.data);
            this.list = response.data.data
            console.log(response.data.total)
            this.total = response.data.total[0].total
            this.listLoading = false


          }).catch((err) => {
            console.log(err)
            this.listLoading =  false
          })
        }else {
          this.getList()
        }
      },
      handleCurrentChange(val) {
        this.listQuery.page = val
        if(Object.keys(this.listQuery).length>2){
          axios.post('http://cmdb.tigerbrokers.net:8000/ip/searchIp',this.listQuery).then(response => {
            console.log(response.data);
            this.list = response.data.data
            console.log(response.data.total)
            this.total = response.data.total[0].total
            this.listLoading = false


          }).catch((err) => {
            console.log(err)
            this.listLoading =  false
          })
        }else {
          this.getList()
        }
      },
      handleEdit(index,row){
        var date = new Date()
        this.dialogStatus = 'edit'
        console.log(row)
        this.temp = Object.assign({}, row)
        this.filterMessage = this.temp.status
        this.transferSelect.splice(0,1,row.ip_id)

        this.temp.ip_id = this.transferSelect


        this.temp.last_editor = this.$store.getters.username
        this.temp.update_date = date
        console.log(this.temp.status)
        console.log(this.filterMessage)

        this.dialogFormVisible = true
      },
//      handleDelete(row){
//        this.$notify({
//          title:'成功',
//          message: '删除成功',
//          type: 'success',
//          duration: 2000
//
//        })
//        const index = this.list.indexOf(row)
//        this.list.splice(index,1)
//      },
//      handleCreate(){
//        this.dialogStatus =  'create'
//        this.dialogFormVisible = true
//      },
      handleDownload() {
        require.ensure([], () => {
          const { export_json_to_excel } = require('@/vendor/Export2Excel')
          const tHeader = ['IP', '掩码', '网关','运营商','城市','位置','状态','修改者','创建日期','更新日期']
          const filterVal = ['ip', 'netmask', 'gateway', 'isp', 'city','position','status','last_editor','create_date','update_date']
          const data = this.formatJson(filterVal, this.list)
          export_json_to_excel(tHeader, data, 'ip数据')
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
      update() {
        this.reverseMessage=this.temp.status
        axios.post('http://cmdb.tigerbrokers.net:8000/ip/editIp', this.temp).then(response => {
          console.log(response)
          this.dialogFormVisible = false
          if(response.data.code=='20000'){
            this.$notify({
              title: '成功',
              message: response.data.msg,
              type: 'success',
              duration: 5000
            })
          }else{
            this.$notify({
              title: '失败',
              message: response.data.msg,
              type: 'warning',
              duration: 5000
            })
          }
          this.getList()
        }).catch(function (error) {
          console.log(error)
        })
      }
      //temp value of multiple selection
//      handleSelectionChange(val){
//        console.log(val)
//        this.temp.val =  val
//        console.log(this.temp.val)
//        this.temp.idc = val[0].idc_id
//        this.temp.oem = val[0].oem_id
//
//      },
//      update(){
//        this.dialogStatus = 'MultiEdit'
//        this.dialogMultiVisible = true
//        this.temp.val.forEach((item, i)=>{
//          console.log(item,i);
//          this.multipleSelection.add(item.device_id);
//        })
//        update(this.temp.oem,this.temp.idc,this.multipleSelection).then(response=>{
//          console.log(response.data);
//          this.$notify({
//            title:'成功',
//            message: '修改成功',
//            type: 'success',
//            duration: 2000
//
//          })
//          this.dialogMultiVisible = false
//        }).catch(error=>{
//          console.log(error)
//        })
//      }

    }
  }
</script>
