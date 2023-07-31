function Forbidden() {
    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="col-lg-12 text-center">
                <div className="logo">
                    <h1>403</h1>
                </div>
                <p className="lead text-muted">
                    Access forbidden! You don't have permission to access this
                    page!
                </p>
            </div>
        </div>
    );
}

export default Forbidden;
