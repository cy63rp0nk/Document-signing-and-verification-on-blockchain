pragma solidity ^0.8.0;

contract DocumentStorage {
    struct Document {
        bytes32 hash;
        address owner;
        bool isVerified;
    }

    mapping(bytes32 => Document) public documents;

    event NewDocument(bytes32 indexed hash, address indexed owner);
    event DocumentVerified(bytes32 indexed hash);

    function addDocument(bytes32 _hash) public {
        require(documents[_hash].hash == 0, "Document already exists");
        require(msg.sender == msg.sender, "Only the owner can add a document");

        documents[_hash] = Document(_hash, msg.sender, false);
        emit NewDocument(_hash, msg.sender);
    }

    function verifyDocument(bytes32 _hash) public {
        require(documents[_hash].hash != 0, "Document does not exist");
        require(msg.sender == msg.sender, "Only the owner can verify a document");

        documents[_hash].isVerified = true;
        emit DocumentVerified(_hash);
    }

    function getDocument(bytes32 _hash) public view returns (bytes32, address, bool) {
        return (documents[_hash].hash, documents[_hash].owner, documents[_hash].isVerified);
    }
}
