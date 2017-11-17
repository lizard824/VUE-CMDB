<template>
  <div class="app-container">
  <el-table
    :data="tableData"
    border
    style="width: 100%">
    <el-table-column
      label="日期"
      width="180">
      <template scope="scope">
        <el-icon name="time"></el-icon>
        <span style="margin-left: 10px">{{ scope.row.date }}</span>
      </template>
    </el-table-column>
    <el-table-column
      label="姓名"
      width="180">
      <template scope="scope">
        <el-popover trigger="hover" placement="top">
          <p>姓名: {{ scope.row.name }}</p>
          <p>权限: {{ scope.row.privilege }}</p>
          <div slot="reference" class="name-wrapper">
            <el-tag>{{ scope.row.name }}</el-tag>
          </div>
          <p>城市：{{ scope.row.cities}}</p>
        </el-popover>
      </template>
    </el-table-column>
    <el-table-column label="操作">
      <template scope="scope">
        <el-button
          size="small"
          @click="handleEdit(scope.row)">编辑</el-button>

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
        <el-button @click="getCheckedNodes">通过 node 获取</el-button>
        <el-button @click="getCheckedKeys">通过 key 获取</el-button>

        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="update">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

  export default {
    data() {
      return {
        formLabelWidth: '120px',
        pivileage: null,
        checkedKey:[2,3,4,5],
        isIndeterminate: true,
        list: null,
        total: null,
        listLoading: true,
        listQuery: {
          page:1,
          limit: 20,
          name:''

        },
        temp:{
          date:'',
          cities:'',
          name:'',
          privilege:''

        },
        dialogFormVisible: false,
        dialogStatus: '',
        tableData: [{
          date: '2016-05-02',
          name: '王小虎',
          privilege: '1',
          cities:''
        }, {
          date: '2016-05-04',
          name: '王小虎',
          privilege: '3',
          cities:''
        }, {
          date: '2016-05-01',
          name: '王小虎',
          privilege: '8',
          cities:''
        }, {
          date: '2016-05-03',
          name: '王小虎',
          privilege: '32',
          cities:''
        }],
        data2: [{
          id: 1,
          label: 'Device',
          children: [{
            id:5,
            label: 'App'},
            {
              id:3,
              label: 'Asset'
          }]
        }, {
          id: 2,
          label: 'VM',
          children: [{
            id: 5,
            label: 'App'
          }, {
            id: 6,
            label: 'Asset'
          }]
        }, {
          id: 3,
          label: 'IPS',
          children: [{
            id: 8,
            label: 'IPS'
          }, {
            id: 9,
            label: 'IP'
          }]
        },
          {
            id: 4,
            label: 'User',

          }],
        defaultProps: {
          children: 'children',
          label: 'label'
        }
      }
    },
    methods: {
      handleEdit(row){
        this.temp = Object.assign({},row)
        this.dialogStatus = 'edit'
        this.dialogFormVisible = true
      },
      handleDelete(index, row) {
        console.log(index, row);
      },
      update(){
        this.cities = this.$refs.tree.getCheckedKeys();
        console.log(this.cities)
        this.dialogFormVisible = false
        this.$notify({
          title: '成功',
          message: '更新成功',
          type: 'success',
          duration: 2000
        })
      },
      getCheckedNodes(){
        console.log(this.$refs.tree.getCheckedNodes());
      },
      getCheckedKeys() {
        console.log(this.$refs.tree.getCheckedKeys());
      }
    },

    mounted(){
      this.list = this.tableData
      this.listLoading = false

    },
  }
</script>
