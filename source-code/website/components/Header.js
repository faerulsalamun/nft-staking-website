import { Container, Nav, Navbar } from "react-bootstrap";

const Header = () => {

    return (
        <Navbar bg="light" expand="lg">
            <Container>
                <Navbar.Brand>Salamun</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link href="/">Home</Nav.Link>
                        <Nav.Link href="/stake">Stake</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default Header;