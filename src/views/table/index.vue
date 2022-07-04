<template>
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.$index }}
        </template>
      </el-table-column>
      <el-table-column label="Title">
        <template slot-scope="scope">
          {{ scope.row.title }}
        </template>
      </el-table-column>
      <el-table-column label="Author" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.author }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Pageviews" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.pageviews }}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="Status" width="110" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{ scope.row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="Display_time" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.display_time }}</span>
        </template>
      </el-table-column>
    </el-table>

    <div style="margin: 30px 0">使用jsbc[list-table]渲染</div>

    <ListTable
      :option="option"
      :data="list"
      :table-loading="listLoading"
      @refresh-change="fetchData"
      @on-load="fetchData"
    >
      <template #status="scope">
        <el-tag :type="scope.row.status | statusFilter">{{ scope.row.status }}</el-tag>
      </template>
      <template #created_at="scope">
        <i class="el-icon-time" />
        <span>{{ scope.row.display_time }}</span>
      </template>
    </ListTable>
  </div>
</template>

<script>
import { getList } from '@/api/table'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      listLoading: true,
      option: {
        indexLabel: 'ID',
        menu: false,
        addBtn: false,
        searchBtn: false,
        column: [
          {
            label: 'Title',
            prop: 'title'
          },
          {
            label: 'Author',
            prop: 'author'
          },
          {
            label: 'Pageviews',
            prop: 'pageviews'
          },
          {
            label: 'Status',
            prop: 'status',
            slot: true
          },
          {
            label: 'Display_time',
            prop: 'created_at',
            slot: true
          }
        ]
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getList().then(response => {
        this.list = response.data.items
        this.listLoading = false
      })
    }
  }
}
</script>
