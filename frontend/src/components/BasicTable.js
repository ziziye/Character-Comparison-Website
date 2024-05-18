import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
export default function BasicTable({ rows, currentPage, setSelectedCharacter, handlePreviousClick, handleNextClick }) {
    return (
        <TableContainer component={Paper} sx={{ border: '5px solid #ffffff', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                <h1 className="text-2xl font-bold p-5">
                        Character Table
                        </h1>
                    <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>Character's Name</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>AuthorName</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Subtitle</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>&nbsp;Detailed Information&nbsp;</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            <TableCell component="th" scope="row">
                                {row.name}
                            </TableCell>
                            <TableCell component="th" scope="row">
                                {row.authorName ? row.authorName : "Unkown"}
                            </TableCell>
                            <TableCell component="th" scope="row">
                                {row.subtitle}
                            </TableCell>
                            <TableCell align="right">
                                <Button color="secondary" onClick={() => setSelectedCharacter(row)}>More Information</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            {/* Pagination buttons */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px' }}>
                <Button disabled={currentPage === 1} onClick={handlePreviousClick} style={{ margin: '0 10px' }}>Previous</Button>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="overline" gutterBottom style={{ margin: '0 10px' }}>
                        {currentPage} Page
                    </Typography>
                </div>
                <Button disabled={currentPage !== 1 && rows.length < 10} onClick={handleNextClick} style={{ margin: '0 10px' }}>Next</Button>
            </div>
        </TableContainer>
    );
}