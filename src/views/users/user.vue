<template>
  <div class="app-container">
  <el-table
    :data="list"
    border
    style="width: 100%">
    <el-table-column
      label="用户名"
      prop="username" sortable>
    </el-table-column>
    <el-table-column
      label="权限"
      prop="perms" sortable>
    </el-table-column>


    <el-table-column label="操作">
      <template scope="scope">
        <el-button
          size="small"
          @click="handleEdit(scope.$index,scope.row)">编辑</el-button>
      </template>
    </el-table-column>
  </el-table>

    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
                     :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
    <el-dialog :title="dialogStatus" :visible.sync="dialogFormVisible">
      <el-tree
        :data="data2"
        show-checkbox
        node-key="id"
        ref="tree"
        :default-checked-keys="checkedKey"
        :props="defaultProps">
      </el-tree>
      <div slot="footer" class="dialog-footer">
        <!--<el-button @click="getCheckedNodes">通过 node 获取</el-button>-->
        <!--<el-button @click="getCheckedKeys">通过 key 获取</el-button>-->

        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="update">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import axios from 'axios'
  export default {
    data() {
      return {
        formLabelWidth: '120px',
        pivileage: null,
        checkedKey:null,
        isIndeterminate: true,
        list: null,
        total: null,
        choices:null,
        listLoading: true,
        listQuery: {
          page:1,
          pagesize: 20,

        },
        temp:{
          username:'',
          perms:''

        },
        dialogFormVisible: false,
        dialogStatus: '',
//        tableData: [{
//          date: '2016-05-02',
//          name: '王小虎',
//          privilege: '1',
//          cities:''
//        }, {
//          date: '2016-05-04',
//          name: '王小虎',
//          privilege: '3',
//          cities:''
//        }, {
//          date: '2016-05-01',
//          name: '王小虎',
//          privilege: '8',
//          cities:''
//        }, {
//          date: '2016-05-03',
//          name: '王小虎',
//          privilege: '32',
//          cities:''
//        }],
        data2: [{
          id: '1',
          label: '资产信息',
          children: [{
            id:'11',
            label: '物理资产',
            children:[{
              id:'11c',
              label:'增加'
            },{
              id:'11u',
              label:'修改'
            },{
              id:'11r',
              label:'查询'
            },{
              id:'11d',
              label:'删除'
            },{
              id:'11l',
              label:'上传'
            }]},
            {
              id:'12',
              label: '虚拟资产',
              children:[{
                id:'12c',
                label:'增加'
              },{
                id:'12u',
                label:'修改'
              },{
                id:'12r',
                label:'查询'
              },{
                id:'12d',
                label:'删除'
              },{
                id:'12l',
                label:'上传'
              }]
          }]
        }, {
          id: '2',
          label: '应用信息',
          children:[{
            id:'2c',
            label:'增加'
          },{
            id:'2u',
            label:'修改'
          },{
            id:'2r',
            label:'查询'
          },{
            id:'2d',
            label:'删除'
          },{
            id:'2l',
            label:'上传'
          }]
        },{
          id: '3',
          label: 'IP地址',
          children: [{
            id:'31',
            label: 'IP地址段',
            children:[{
              id:'31c',
              label:'增加'
            },{
              id:'31u',
              label:'修改'
            },{
              id:'31r',
              label:'查询'
            },{
              id:'31d',
              label:'删除'
            },{
              id:'31l',
              label:'上传'
            }]},
            {
              id:'32',
              label: 'IP',
              children:[{
                id:'32u',
                label:'修改'
              },{
                id:'32r',
                label:'查询'
              },{
                id:'32l',
                label:'上传'
              }]
            }]
        } ,{
          id: '4',
          label: 'IDC机房',
          children:[{
            id:'4c',
            label:'增加'
          },{
            id:'4u',
            label:'修改'
          },{
            id:'4r',
            label:'查询'
          },{
            id:'4d',
            label:'删除'
          },{
            id:'4l',
            label:'上传'
          }]
        },{
          id:'5',
          label:'User'
        }],
        defaultProps: {
          children: 'children',
          label: 'label'
        }
      }
    },
    created(){
      this.getList()
      console.log('geting list..')
    },
    methods: {
      getList(){
        this.listLoading = true
        axios.get('http://cmdb.tigerbrokers.net:8000/user/getPerms',{params:this.listQuery}).then(response=>{
          console.log(response.data);
          this.list = response.data.data
          console.log(response.data.total)
          this.total = response.data.total[0].total
          this.listLoading = false
        }).catch((err)=> {
          console.log(err)
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
        console.log(row)
        this.temp = Object.assign({},row)
        this.checkedKey=this.temp.perms.split(',')
        console.log(this.checkedKey)
        this.dialogStatus = 'edit'
        this.dialogFormVisible = true
      },
      handleDelete(index, row) {
        console.log(index, row);
      },
      update(){
        this.choices = this.$refs.tree.getCheckedKeys();
        console.log(this.choices)
        this.temp.perms=this.choices.toString()

        axios.post('http://cmdb.tigerbrokers.net:8000/user/editPerms',this.temp).then(response=>{
          console.log(response.data)
          this.dialogFormVisible = false
          this.$notify({
            title: '成功',
            message: response.data.msg,
            type: 'success',
            duration: 2000
          })
          this.getList()
        }).catch((err)=>{
          console.log(err)
        })

      },
      getCheckedNodes(){
        console.log(this.$refs.tree.getCheckedNodes());
      },
      getCheckedKeys() {
        console.log(this.$refs.tree.getCheckedKeys());
      }
    }
  }
</script>
