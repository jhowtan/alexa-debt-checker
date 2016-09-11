# TechCrunch Disrupt 2016 Submission

**Status: Incomplete, discontinued.**

## DebtChecker Alexa Skill

*"A Lannister always pays his debts."*
*"Be a man, do the right thing."*

The idea was to use Splitwise API to retrieve existing expenses owed to friends.
Followed by using a payment transaction API invoked over a server through Alexa
to pay those debts, just because you can.

I decided to stop pursuing this project submission because the use case was not
carefully researched: Braintree payments API is used for customer to merchant
payments, which is a completely different use case from Venmo, which can be used
to transfer cash/credits to personal groups.

However, there are some learning points from this short foray into the AWS
developer documentation and console:

- AWS Lambda is awesome: you could dive directly into the application without
worrying about any of the bare metal container related setup.
- AWS CloudFormation is pretty cool as well: defining rules to bring up a stack
for any AWS cloud based application is pretty handy, especially in a hackathon
setting.
- Alexa Skills Kit does not allow for dynamic slots, which makes it harder for
Alexa to 'learn' new information from API calls for reuse in subsequent sessions

## Use cases considered:

APIs that were chosen (albeit with little consideration or research) include the
Braintree API, Alexa Skills Kit, and the use of Domain.com's .CLUB domain
registration, to which a joke was to be played on a Game of Throne trope.

1. Pay money (Braintree/Paypal/Venmo)
2. Request for money (Braintree/Paypal/Venmo)
3. See outstanding debts (Splitwise)
4. Resolve debts
  - All debts
  - Only debts to person X

## Details considered for the Voice UX:

### Language processing:

Intents have to be manually enumerated in a list of 'Utterances', which is matched
through Alexa/AWS's NLP processing.

For the 'magic' to work in creating a smooth voice user experience, there were
several key points of consideration as to how money should be referred to:

(dollars, bucks) **AND** (cent(s), dime, nickel, quarter, half dollar):

- parse ten dollars -> $10.00
- "ten fifty" -> $10.50
- "hundred bucks" -> $100
- "two quarters" -> $0.50
- "three pence" -> $0.30

### User Experience (Voice) considerations:

Also, other considerations on how to follow up (actionable intents) on the
newly retrieved information for outstanding debts include:

- Does the user want to pay a user that was queried?
- Does the user want to find out about another person that he owes?
- Does the user want to resolve all debts without actually knowing the debt?
- How do we ensure that this is a secure operation?

Although a server could have been easily set up to act as another layer of
abstraction for the APIs provided, as the primary use case of resolving the
debts could not be solved with the prevailing APIs to be used, I decided to stop
work after implementing the following features:

1. Retrieving a list of all friends to whom I owed money to.
2. Retrieving information on how much money I owed a particular friend.

## Development

I started off with the Alexa tutorial as viewed on
[bit.ly/alexafactvid](http://bit.ly/alexafactvid). Since this was a hackathon,
I used cookies to skip the much necessary OAuth callbacks for proper RESTful
API calls to get the results I want quickly.

My workflow for developing the Alexa skill was as such:

1. Develop off a text editor for the `*.js` files which were relevant to the project
2. Ran `make` to zip the files required (because using the UI is slow)
3. Upload the zip file manually to run the test code to inspect errors
4. Used [echoism.io](echoism.io) to invoke the utterances that called the function handlers
5. Used CloudWatch to inspect the requests as they streamed in

---

*by Jonathan Tan,*
*September 11 2016*
[@jhwtan](https://twitter.com/jhwtan)
[LinkedIn](https://www.linkedin.com/in/jhowtan)
