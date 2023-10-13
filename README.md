import cx_Oracle
import csv

# Oracle connection data
oracle_username = 'your-oracle-username'
oracle_password = 'your-oracle-password'
oracle_dsn = cx_Oracle.makedsn('oracle-host', 'oracle-port', 'oracle-service')

# Create a connection to the Oracle database
with cx_Oracle.connect(oracle_username, oracle_password, oracle_dsn) as connection:
    with connection.cursor() as cursor:

        # Execute a query to fetch data
        query = "select c.id,c.CASE_NUMBER as Ma,c.PRIORITY as UuTien,c.STATUS as TinhTrang,c.NAME as ChuDe,cstm.RECEIVE_FROM_C as TiepNhanTu,cstm.TYPE_C as PhanLoai,cstm.DOI_TUONG_YEU_CAU_C as DoiTuongYeuCau,cstm.MA_CHI_NHANH_C as MaChiNhanh,cstm.EMAIL_NGUOI_GUI_C as EmailNguoiGui,c.DESCRIPTION as NoiDungPhanHoi,c.RESOLUTION as HuongGiaiQuyet,cstm.CUSTOMER_ESTIMATE_C as KhachHangDanhGia,cstm.CUSTOMER_ESTIMATE_DETAIL_C as YKienKhachHang,c.ASSIGNED_USER_ID as NguoiPhuTrach,(select USER_NAME from CRMPGB.USERS where ID = c.ASSIGNED_USER_ID) as NguoiPhuTrach_username,c.ACCOUNT_NAME as TenKhachhang,cstm.REQUESTED_USER_ID_C as NguoiYeuCauNoiBo,(select USER_NAME from CRMPGB.USERS where ID = cstm.REQUESTED_USER_ID_C) as NguoiYeuCauNoiBo_username,c.DATE_MODIFIED as NgaySuaCuoi,c.DATE_ENTERED as NgayTao,cstm.CATEGORY_C as LinhVuc,cstm.SUB_CATEGORY_C as LinhVucChiTiet,c.ACCOUNT_ID as MaKhachHang from CRMPGB.CASES c join CRMPGB.CASES_CSTM cstm on c.ID = cstm.ID_C"
        cursor.execute(query)
        result = cursor.fetchall()

        # Get column names from the cursor description
        column_names = [desc[0] for desc in cursor.description]

        # Specify the filename of the CSV file
        filename = "data.csv"

        # Writing data into a CSV file
        with open(filename, mode='w', newline='') as file:
            writer = csv.writer(file)

            # Write the column names into the CSV file
            writer.writerow(column_names)

            # Write the data into the CSV file
            writer.writerows(result)

print(f"Data from {oracle_username} has been written to {filename} successfully.")
