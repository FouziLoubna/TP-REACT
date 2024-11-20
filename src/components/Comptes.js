import React, { useState, useEffect } from "react";
import axios from "axios";

const CompteManager = () => {
    const [comptes, setComptes] = useState([]); // Liste des comptes
    const [selectedCompte, setSelectedCompte] = useState(null); // Compte sélectionné pour modification
    const [newCompte, setNewCompte] = useState({ solde: "", dateCreation: "", type: "COURANT" }); // Nouveau compte
    const [message, setMessage] = useState(""); // Message pour affichage d'état
    const [isDisabled, setIsDisabled] = useState(false); // Gérer l'état désactivé

    const API_URL = "http://localhost:8080/banque/comptes";

    // Charger les comptes au démarrage
    useEffect(() => {
        fetchComptes();
    }, []);

    // Fonction pour récupérer tous les comptes
    const fetchComptes = async () => {
        try {
            const response = await axios.get(API_URL);
            setComptes(response.data);
        } catch (error) {
            console.error("Erreur lors du chargement des comptes:", error);
        }
    };

    // Ajouter un compte
    const addCompte = async () => {
        try {
            setIsDisabled(true);
            const response = await axios.post(API_URL, newCompte);
            setComptes([...comptes, response.data]);
            setMessage("Compte ajouté avec succès !");
            setNewCompte({ solde: "", dateCreation: "", type: "COURANT" });
        } catch (error) {
            console.error("Erreur lors de l'ajout du compte:", error);
        } finally {
            setIsDisabled(false);
        }
    };

    // Modifier un compte
    const updateCompte = async () => {
        try {
            setIsDisabled(true);
            const response = await axios.put(`${API_URL}/${selectedCompte.id}`, selectedCompte);
            setComptes(comptes.map((compte) => (compte.id === selectedCompte.id ? response.data : compte)));
            setMessage("Compte mis à jour avec succès !");
            setSelectedCompte(null);
        } catch (error) {
            console.error("Erreur lors de la mise à jour du compte:", error);
        } finally {
            setIsDisabled(false);
        }
    };

    // Supprimer un compte
    const deleteCompte = async (id) => {
        try {
            setIsDisabled(true);
            await axios.delete(`${API_URL}/${id}`);
            setComptes(comptes.filter((compte) => compte.id !== id));
            setMessage("Compte supprimé avec succès !");
        } catch (error) {
            console.error("Erreur lors de la suppression du compte:", error);
        } finally {
            setIsDisabled(false);
        }
    };

    return (
        <div className="container mt-4">
            <h1 className="text-center">Gestion des Comptes</h1>
            {message && <div className="alert alert-success">{message}</div>}

            {/* Liste des comptes */}
            <h2 className="mt-4">Liste des Comptes</h2>
            <table className="table table-striped">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Solde</th>
                    <th>Date de Création</th>
                    <th>Type</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {comptes.map((compte) => (
                    <tr key={compte.id}>
                        <td>{compte.id}</td>
                        <td>{compte.solde}</td>
                        <td>{compte.dateCreation}</td>
                        <td>{compte.type}</td>
                        <td>
                            <button
                                className="btn btn-primary btn-sm"
                                onClick={() => setSelectedCompte(compte)}
                                disabled={isDisabled}
                            >
                                Modifier
                            </button>
                            <button
                                className="btn btn-danger btn-sm ms-2"
                                onClick={() => deleteCompte(compte.id)}
                                disabled={isDisabled}
                            >
                                Supprimer
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {/* Ajouter ou Modifier un compte */}
            <h2 className="mt-4">{selectedCompte ? "Modifier un Compte" : "Ajouter un Compte"}</h2>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    selectedCompte ? updateCompte() : addCompte();
                }}
            >
                <div className="mb-3">
                    <label>Solde</label>
                    <input
                        type="number"
                        className="form-control"
                        placeholder="Solde"
                        value={selectedCompte ? selectedCompte.solde : newCompte.solde}
                        onChange={(e) =>
                            selectedCompte
                                ? setSelectedCompte({ ...selectedCompte, solde: e.target.value })
                                : setNewCompte({ ...newCompte, solde: e.target.value })
                        }
                        required
                        disabled={isDisabled}
                    />
                </div>
                <div className="mb-3">
                    <label>Date de Création</label>
                    <input
                        type="date"
                        className="form-control"
                        value={selectedCompte ? selectedCompte.dateCreation : newCompte.dateCreation}
                        onChange={(e) =>
                            selectedCompte
                                ? setSelectedCompte({ ...selectedCompte, dateCreation: e.target.value })
                                : setNewCompte({ ...newCompte, dateCreation: e.target.value })
                        }
                        required
                        disabled={isDisabled}
                    />
                </div>
                <div className="mb-3">
                    <label>Type</label>
                    <select
                        className="form-control"
                        value={selectedCompte ? selectedCompte.type : newCompte.type}
                        onChange={(e) =>
                            selectedCompte
                                ? setSelectedCompte({ ...selectedCompte, type: e.target.value })
                                : setNewCompte({ ...newCompte, type: e.target.value })
                        }
                        disabled={isDisabled}
                    >
                        <option value="COURANT">COURANT</option>
                        <option value="EPARGNE">EPARGNE</option>
                    </select>
                </div>
                <button type="submit" className="btn btn-success me-2" disabled={isDisabled}>
                    {selectedCompte ? "Mettre à jour" : "Ajouter"}
                </button>
                {selectedCompte && (
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => setSelectedCompte(null)}
                        disabled={isDisabled}
                    >
                        Annuler
                    </button>
                )}
            </form>
        </div>
    );
};

export default CompteManager;
