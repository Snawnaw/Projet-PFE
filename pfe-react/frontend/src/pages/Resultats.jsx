const Résultats = () => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const response = await axios.get(`/api/v1/submissions/student/${studentId}/results`);
                setResults(response.data.submissions);
            } catch (err) {
                console.error('Erreur lors de la récupération des résultats :', err);
            } finally {
                setLoading(false);
            }
        };
        fetchResults();
    }, []);

    if (loading) return <div>Chargement...</div>;

    return (
        <div>
            <h2>Résultats</h2>
            <ul>
                {results.map(result => (
                    <li key={result._id}>
                        Examen : {result.examId.name} - Score : {result.score}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Résultats;