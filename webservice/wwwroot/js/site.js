// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.
var tim_kiem_nang_cao = document.getElementById("tim_kiem_nang_cao");
tim_kiem_nang_cao.addEventListener("click", () => {
    if (tim_kiem_nang_cao.textContent === "Ẩn") {
        tim_kiem_nang_cao.textContent = "Tìm kiếm nâng cao";
        document.querySelectorAll(".filter_nang_cao").forEach(z => {
            z.style.display = "none";
        });
    } else {
        tim_kiem_nang_cao.textContent = "Ẩn";
        document.querySelectorAll(".filter_nang_cao").forEach(z => {
            z.style.display = "block";
        });
    }
});

var filter_div = document.getElementById("filter_div");
var search_trigger = document.getElementById("search_trigger");
search_trigger.addEventListener("click", () => {
    if (filter_div.classList.contains("d-none")) {
        filter_div.classList.remove("d-none");
        filter_div.classList.add("d-flex");
        search_trigger.innerHTML = `Search <i class="fa-solid fa-angle-down"></i>`;
    } else {
        filter_div.classList.remove("d-flex");
        filter_div.classList.add("d-none");
        search_trigger.innerHTML = `Search <i class="fa-solid fa-angle-up"></i>`;
    }
});

function ConvertEmail(id) {
    parent.postMessage({
        'func': 'ConvertEmail',
        'message': id
    }, "*");
}

var t = new DatatableC();
t.searching = false;
t.info = true;
t.bLengthChange = false;
t.Init("#danh_sach", window.location.origin + "/Contact/GetData", DataTableOptions.param_FormData("filter_form"),
    [
        new DatatableColumn("Tên khách hàng", "c_tendn", "text-start", (data, type, row, meta) => {
            var tenvt = row.c_tenvt == '' || row.c_tenvt == null ? "" : `(` + row.c_tenvt + `)`;
            if (document.getElementById("isEmail").value == '2') {
                return `<a class="cus-a" onclick="ConvertEmail('` + row.id + `')" style="text-decoration: none;"><span class="" name="" style="color: #666666 !important;"><span class="cus-name" style="font-size: 13px;font-weight: 600;color: #183247;">` + data + `</span> ` + tenvt + ` <br><i></i></span></a>`;
            }
            else {
                return `<a class="cus-a" href="http://crm-cs.msb.com.vn/jw/web/userview/support/vsupport/_/runTicketPopup?embed=true&amp;fkKH=` + row.id + `&amp;phoneIni=` + document.getElementById("so_dien_thoai").value + `&amp;idMakeCall=` + document.getElementById("idMakeCall").value + `&amp;idCallback=` + document.getElementById("idCallback").value + `&amp;category=` + document.getElementById("category").value + `&amp;subCategory=` + document.getElementById("subCategory").value + `&amp;item=` + document.getElementById("item").value + `" style="text-decoration: none;"><span class="" name="" style="color: #666666 !important;"><span class="cus-name" style="font-size: 13px;font-weight: 600;color: #183247;">` + data + `</span> ` + tenvt + ` <br><i></i></span></a>`;
            }
        }),
        new DatatableColumn("ĐKKD/MST/CMND/CCCD/PP", "c_masothue_all"),
        new DatatableColumn("CIF", "c_cif"),
        new DatatableColumn("SĐT Di động", "c_phone"),
        new DatatableColumn("SĐT Gọi đến", "c_phoneini"),
        new DatatableColumn("Email", "c_email", "text-start", (data, type, row, meta) => {
            return data ? data.replaceAll("u0000", "") : "";
        }),
        new DatatableColumn("-", "id", "", (data, type, row, meta) => {
            return `<a href="http://crm-cs.msb.com.vn/jw/web/userview/support/vsupport/_/lsTickets?embed=true&amp;KEY=` + row.id + `" class=""> <span name="tooltip-ticket" class="fa fa-ticket view" aria-hidden="true"></span></a>`;
        })
    ]);

var so_dong_tren_trang = document.getElementById("so_dong_tren_trang");
var btn_search = document.getElementById("btn_search");
btn_search.addEventListener("click", () => {
    t.table.page.len(Number(so_dong_tren_trang.value)).draw(true);
});

