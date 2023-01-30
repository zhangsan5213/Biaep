pragma solidity ^0.4.24;

contract Biaep
{
    address public author;
    // Author of this new methodology.
    string public ref;
    // The experiment this new methodology might have referred to.
    string public cloudFileAddress;
    // Address where the file is saved on Amazon S3.
    string public fileHash;
    // The SHA256 of the BIP file and data.

    uint public price;
    // Price required for uploading and voting.
    
    int public numberofVotes = 0;
    int public positiveVotes = 0;
    int public negativeVotes = 0;

    mapping(address => int) public votes;

    constructor(
        string cloudFileAddressInput,
        string fileHashInput,
        string refInput) payable public {

        author = msg.sender;
        price  = 0.001 ether;

        cloudFileAddress = cloudFileAddressInput;
        fileHash   = fileHashInput;
        ref        = refInput;
    }

    function get_time() public constant returns (uint) {
        return block.timestamp;
    }

    function vote(int voteInput) payable public {
        require(msg.sender != author);
        require(votes[msg.sender] == 0);
        require(msg.value == price);

        votes[msg.sender] = voteInput;
        numberofVotes += 1;

        if (voteInput == 1) {
            positiveVotes += 1;
        } else if (voteInput == -1) {
            negativeVotes += 1;
        }
    }

}