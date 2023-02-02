pragma solidity ^0.8.0;

contract Signing {
    mapping (bytes32 => address) public signatures;
    event DocumentSigned(bytes32 indexed documentHash, address signer);

    function signDocument(bytes32 documentHash) public {
        require(signatures[documentHash] == address(0), "Document already signed");
        signatures[documentHash] = msg.sender;
        emit DocumentSigned(documentHash, msg.sender);
    }
    
    function getSigner(bytes32 documentHash) public view returns (address){
        return signatures[documentHash];
    }
}
