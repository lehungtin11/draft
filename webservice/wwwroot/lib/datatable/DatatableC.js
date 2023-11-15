class DatatableColumn {
    constructor(title = "", data = "", className = "", render = function (data, type, row, meta) { return data; }, orderable = false, searchable = true, visible = true, type="", defaultContent = "", width = "", cellType = "td")
    {
        this.title = title;
        this.name = data;
        this.data = data;
        this.orderable = orderable;
        this.searchable = searchable;
        this.cellType = cellType;
        this.defaultContent = defaultContent;
        if (width!=="") {
            this.width = width;
        }
        if (type !==undefined && type !== "") {
            this.type = type;
        }
        if (render !== undefined && render !== null && render !== {}) {
            this.render = function (data, type, row, meta) {
                if (type === "sort" || type === 'type')
                    return data;
                return render(data, type, row, meta);
            };
        }
        this.className = className;
        this.visible = visible;
    }
}
var DataTableOptions = {
    TaoNutXoa: function (btnHtml) {
        if (btnHtml) {
            document.write(`<button class="btn btn-danger" type="button" data-toggle="modal" data-target="#popupXacNhanXoa">${btnHtml}</button>`);
        } else {
            document.write(`<button class="btn btn-danger" type="button" data-toggle="modal" data-target="#popupXacNhanXoa"><i class="fa fa-trash-o" aria-hidden="true"></i> Xóa nhiều</button>`);
        }
    }
    ,
    selectStyle: {
        api: "api",
        single: "single",
        multi: "multi",
        os: "os",
        multiShift: "multi+shift"
    },
    selectItems: {
        row: "row",
        column: "column",
        cell: "cell"
    },
    selectSelector: {
        row: "td, th",
        firstCell: "td:first-child"
    },
    orderOpt: {
        asc: "asc",
        desc: "desc"
    },
    order: function (index = 0, orderOption = "asc") {
        return [[index, orderOption]];
    },
    param_FormData: function (formId, formData, formE, formDataFunc) {
        return function (d) {
            var fd = new FormData();
            if (formId !== undefined && formId !== null && formId !== "") {
                fd = new FormData(document.getElementById(formId));
            } else if (formData !== undefined && formData !== null) {
                fd = formData;
            } else if (formE) {
                fd = new FormData(formE);
            } else {
                fd=formDataFunc();
            }
            for (var pair of fd.entries()) {
                if (pair[1] !== undefined && pair[1] !== null && pair[1] !== "") {
                    d[pair[0]] = pair[1];
                }
            }
        };
    },
    dataSrc_DataString: function (json) {
        return JSON.parse(json.data);
    }
};
class DatatableC {
    constructor() {
        this.table = {};
        this.OnSelectRow = function (e, dt, type, indexes) {
        };
        this.onDeSelectRow = function (e, dt, type, indexes) {
        };
        this.onRowDoubleClick = function (data) { };
        this.order = [];
        //this.rowId = "DT_RowId";
        this.language = {
            lengthMenu: "Hiển thị _MENU_ dòng trên trang",
            zeroRecords: "Không có dữ liệu",
            info: "Đang hiển thị trang _PAGE_ trong tổng _PAGES_ trang",
            infoEmpty: "Không có dòng dữ liệu nào",
            infoFiltered: "(Lọc từ _MAX_ dòng)",
            search: "Tìm kiếm",
            paginate: {
                previous: "Trước",
                next: "Tiếp",
                last: "Cuối",
                first: "Đầu"
            },
            loadingRecords: "Đang tải, vui lòng chờ...",
            thousands: ".",
            emptyTable: "Không có dữ liệu",
            select: {
                rows: {
                    _: "Đã chọn %d dòng",
                    1: "Đã chọn 1 dòng"
                }
            },
            processing: "Đang tải dữ liệu..."
        };
        this.fixedColumns = {
            leftColumns: 0,
            rightColumns: 0
        };
        this.paging = true;
        this.pageLength = 10;
        this.serverSide = true;
        this.searching = true;
        this.processing = true;
        this.stateSave = false;
        this.querySelector = "";
        this.url = "";
        this.param = function (d) { };
        this.dataSrc = function (json) {
            if (json.data!==null) {
                return json.data;
            } else {
                return [];
            }
        };
        this.columns = [new DatatableColumn("CHỌN","", 'select-checkbox', () => { }, false, false)];
        this.select = {
            style: DataTableOptions.selectStyle.multiShift,
            selector: DataTableOptions.selectSelector.firstCell,
            items: DataTableOptions.selectItems.row,
            className: 'selected',
            blurable: false
        };
        this.scrollX = false;
        this.deferRender = true;
        this.createdRow = function (row, data, dataIndex) { };
        this.drawCallback = function (settings) { };
        this.InitComplete = function (settings, json) { };
        this.autoWidth = true;
        this.data = undefined;
        this.info = true;
        this.bLengthChange=true;
    }
    SelectAllRows() {
        this.table.rows().select();
    }
    DeSelectAllRows() {
        this.table.rows().deselect();
    }
    GetSelectedRows() {
        return this.table.rows({ selected: true }).data();
    }
    GetSelectedRowsCount() {
        return this.table.rows('.selected').count();
    }
    GetSelectedRowsIndex() {
        return this.table.rows({ selected: true })[0];
    }
    GetSelectedCells() {
        return this.table.cells({ selected: true }).data();
    }
    GetSelectedColumns() {
        return this.table.columns({ selected: true }).data();
    }
    GetTableData() {
        return this.table.rows().data();
    }
    ReloadTable(keepPosition) {
        if (keepPosition !== undefined && keepPosition!==null) {
            this.table.draw(!keepPosition);
        } else {
            this.table.draw();
        }
    }
    AddOneRow(rowData) {
        this.table.rows.add([rowData]);
    }
    AddRows(arrayOfData) {
        this.table.rows.add(arrayOfData);
    }
    GetRowData(rowIndex) {
        var thisE = this;
        return Object.assign({}, thisE.table.row(rowIndex).data());
    }
    UpdateRow(rowIndex, data) {
        this.table.row(rowIndex).data(data);
    }
    RemoveSelectedRows() {
        this.table.rows({ selected: true }).remove();
        var d = this.GetTableData();
        this.table.clear().rows.add(d).draw();
    }
    SetNewData(newDataArray) {
        this.table.clear();
        this.table.rows.add(newDataArray);
        this.table.draw();
    }
    ClearData() {
        this.table.clear();
    }
    SelectRow(rowId) {
        this.table.row(rowId).select();
    }
    DeSelectRow(rowId) {
        this.table.row(rowId).deselect();
    }
    HideColumn(columnId) {
        this.table.column(columnId).visible(false);
    }
    ShowColumn(columnId) {
        this.table.column(columnId).visible(true);
    }
    GetPageInfo() {
        return this.table.page.info();
    }
    GetRowCount() {
        return this.table.data().count();
    }
    NextPage() {
        this.table.page('next').draw(false);
    }
    PreviousPage() {
        this.table.page('previous').draw(false);
    }
    FirstPage() {
        this.table.page('first').draw(false);
    }
    LastPage() {
        this.table.page('last').draw(false);
    }
    GetCurrentPageNumber() {
        return this.table.page()+1;
    }
    ChangePage(pageNum) {
        this.table.page(pageNum - 1).draw(false);
    }
    MoveRowToTop(rowId) {
        var d = this.GetTableData();
        d.unshift(d.splice(rowId, 1)[0]);
        this.SetNewData(d);
    }
    MoveSelectedRowsToTop() {
        var rowIndexs = this.GetSelectedRowsIndex();
        var d = this.GetTableData();
        rowIndexs.forEach(e => {
            d.unshift(d.splice(e, 1)[0]);
        });
        this.SetNewData(d);
        for (var i = 0; i < rowIndexs.length; i++) {
            this.SelectRow(i);
        }
    }
    Init(querySelector = this.querySelector, url = this.url, param = this.param, columns = this.columns, columnDefs = this.columnDefs) {
        var newStyle = document.createElement("style");
        newStyle.innerHTML = `.dataTables_processing {background-color: #ffffce;}.dataTable td,.dataTable th{white-space: nowrap;}th[class~="select-checkbox"]{text-align:center;}`;
        document.head.appendChild(newStyle);
        var thisE = this;
        $.fn.dataTable.ext.errMode = 'none';
        thisE.table = $(querySelector).on('error.dt', function (e, settings, techNote, message) {
            thongBaoE.Error(message);
        }).on('preXhr.dt', function (e, settings, data) {
            data.columns = undefined;
        }).DataTable({
            "info": thisE.info,
            "pageLength": thisE.pageLength,
            "serverSide": thisE.serverSide,
            "searching": thisE.searching,
            "scrollX": thisE.scrollX,
            "select": thisE.select,
            "autoWidth": thisE.autoWidth,
            "processing": thisE.processing,
            "stateSave": thisE.stateSave,
            "order": thisE.order,
            "data": thisE.data,
            "ajax": thisE.serverSide ? {
                "url": url,
                "method": "post",
                "data": param,
                "dataSrc": thisE.dataSrc
            } : undefined,
            //"rowId": thisE.rowId,
            "initComplete": function(settings, json) {
                $(querySelector).wrap('<div class="DatatableWrapDiv"></div>');
                thisE.InitComplete(settings, json);
                $(".DatatableWrapDiv").css("overflow-x", "auto");
                $(".DatatableWrapDiv").css("width", "100%");
                $(querySelector + " tbody").on('dblclick', 'tr', function() {
                    thisE.onRowDoubleClick(thisE.table.row(this).data());
                });
                document.querySelectorAll(querySelector+" th.select-checkbox").forEach(e => {
                    e.style.cursor = "pointer";
                    e.addEventListener("click", function () {
                        if (thisE.GetSelectedRows().length === thisE.GetTableData().length) {
                            thisE.DeSelectAllRows();
                        } else {
                            thisE.SelectAllRows();
                        }
                    });
                });
            },
            "drawCallback": thisE.drawCallback,
            "language": thisE.language,
            "columns": columns,
            "createdRow": thisE.createdRow,
            "bLengthChange":thisE.bLengthChange
        });
        thisE.table
            .on('select', function(e, dt, type, indexes) {
                thisE.OnSelectRow(e, dt, type, indexes);
            })
            .on('deselect', function(e, dt, type, indexes) {
                thisE.onDeSelectRow(e, dt, type, indexes);
            });
    }
    TaoPopupXacNhanXoa(url, fieldName="id", completedCallback, idPopup = "popupXacNhanXoa", noiDung = "Xóa các dòng đã chọn?") {
        var thisE = this;
        var divPopupXoa = document.createElement("div");
        divPopupXoa.innerHTML = `<div class="modal" id="${idPopup}" role="dialog" aria-labelledby="${idPopup}-label">
                                    <div class="modal-dialog modal-sm" role="document">
                                        <div class="modal-content">
                                            <div class="modal-body">
                                                <div class="row">
                                                    <div class="col-lg-12">
                                                        ${noiDung}
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="modal-footer">
                                                <button type="button" class="btn btn-danger" id="${idPopup}_btnXoa">Có</button>
                                                <button type="button" class="btn btn-default" data-dismiss="modal">Không</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>`;
        document.body.appendChild(divPopupXoa);
        var p = $("#" + idPopup);
        document.getElementById(idPopup + "_btnXoa").addEventListener("click", function () {
            var ids = [];
            if (d.length > 0) {
                let d = this.table.rows({ selected: true }).data();
                if (!fieldName) {
                    for (field in d[0]) {
                        if (field.toUpperCase().includes("ID")) {
                            fieldName = field;
                            break;
                        }
                    }
                }
                if (fieldName) {
                    for (let i = 0; i < d.length; i++) {
                        ids.push(d[i][fieldName]);
                    }
                } else {
                    thongBaoE.Show("Lỗi code: TaoPopupXacNhanXoa fieldName is empty");
                }
            }

            if (ids.length > 0) {
                thongBaoE.Wait("Vui lòng chờ...");
                $.post(url, { ids: ids }).done(z => {
                    if (z.isError) {
                        thongBaoE.Show("Lỗi xảy ra. Nội dung lỗi: " + z.error, 20000);
                    } else {
                        thongBaoE.Show("Đã xóa xong");
                        p.modal("toggle");
                        thisE.ReloadTable(true);
                        if (completedCallback !== undefined) {
                            completedCallback();
                        }
                    }
                    $("#" + idPopup).modal("hide");
                }).fail(x => {
                    thongBaoE.Error();
                });
            } else {
                thongBaoE.Show("Vui lòng chọn các dòng cần xóa");
                p.modal("toggle");
            }
        });
    }
}