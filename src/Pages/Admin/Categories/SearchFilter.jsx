const SearchFilter = ({
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
}) => {
    return (
        <div className="flex items-center gap-4">
            <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por nombre"
                className="w-64 p-2 border border-gray-300 rounded"
            />
            <select
                className="p-2 border border-gray-300 rounded"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
            >
                <option value="">Todos</option>
                <option value="true">Activos</option>
                <option value="false">Inactivos</option>
            </select>
        </div>
    );
};

export default SearchFilter;
