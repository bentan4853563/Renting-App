import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  DataGrid,
  GridColDef,
  GridPaginationModel,
  GridRowParams,
} from "@mui/x-data-grid";
import { parseISO, format } from "date-fns";
import { handleGetProducts } from "../../../actions/product";
import { addBaseURL } from "../../../utils/addBaseURL";

// Define the columns based on the Product model
const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 50 },
  { field: "name", headerName: "Name", flex: 1 }, // Use flex for responsive width
  {
    field: "image",
    headerName: "Photo",
    width: 150,
    renderCell: (params) => (
      <img
        src={addBaseURL(params.value)}
        alt={params.row.name}
        style={{
          width: "50px",
          height: "50px",
          objectFit: "cover",
          padding: "4px",
          borderRadius: "8px",
        }}
      />
    ),
  },
  { field: "rentalCostPerDay", headerName: "Rental Cost/Day", flex: 1 }, // Use flex for responsive width
  {
    field: "createdAt",
    headerName: "Created At",
    flex: 1,
    valueFormatter: (_, row) => {
      if (!row.createdAt) return "N/A";
      return format(parseISO(row.createdAt), "yyyy-MM-dd HH:mm");
    },
  }, // Use flex for responsive width
];

export default function ProductList() {
  const navigate = useNavigate();

  // State to hold Product rows, pagination model, and loading state
  const [rows, setRows] = useState([]);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 5,
  });
  const [loading, setLoading] = useState(true);

  // Fetch Products on pagination model change
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await handleGetProducts(
          paginationModel.page + 1,
          paginationModel.pageSize
        );

        // Update rows with fetched data, ensuring unique IDs
        if (data) {
          const updatedData = data.customers.map((item: object, index: number) => ({
            id: index + 1,
            ...item,
          }));
          setRows(updatedData);
        }
      } catch (error) {
        console.error("Error fetching Products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [paginationModel]);

  // Handle pagination model changes
  const handlePaginationModelChange = (
    newPaginationModel: GridPaginationModel
  ) => {
    setPaginationModel(newPaginationModel);
  };

  // Navigate to edit page on row click
  const handleRowClick = (params: GridRowParams) => {
    navigate(`/products/${params.row._id}/inventory`);
  };

  return (
    <div className="mt-12">
      <DataGrid
        rows={rows}
        getRowId={(row) => row.id} // Use id as a unique identifier
        columns={columns}
        paginationModel={paginationModel}
        onPaginationModelChange={handlePaginationModelChange}
        pageSizeOptions={[5, 10]} // Pagination options
        loading={loading} // Show loading state
        onRowClick={handleRowClick} // Handle row click for navigation
        sx={{
          "& .MuiDataGrid-row": {
            cursor: "pointer", // Change cursor to pointer for clickable rows
          },
          backgroundColor: "white",
        }}
      />
    </div>
  );
}
