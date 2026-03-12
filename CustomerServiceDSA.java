import java.util.*;

class CustomerServiceDSA {

    static Queue<String> ticketQueue = new LinkedList<>();
    static Stack<String> actionStack = new Stack<>();
    static LinkedList<String> ticketList = new LinkedList<>();

    static Scanner sc = new Scanner(System.in);

    // Queue Operations
    static void addTicket() {
        System.out.print("Enter ticket name: ");
        String ticket = sc.nextLine();
        ticketQueue.add(ticket);
        actionStack.push("Added ticket: " + ticket);
        System.out.println("Ticket added to queue.");
    }

    static void processTicket() {
        if(ticketQueue.isEmpty()) {
            System.out.println("No tickets in queue.");
        } else {
            String t = ticketQueue.remove();
            System.out.println("Processing ticket: " + t);
        }
    }

    static void displayQueue() {
        System.out.println("Ticket Queue: " + ticketQueue);
    }

    // Stack Operations
    static void undoAction() {
        if(actionStack.isEmpty()) {
            System.out.println("No actions to undo.");
        } else {
            System.out.println("Undo: " + actionStack.pop());
        }
    }

    // Linked List Operations
    static void addLinkedTicket() {
        System.out.print("Enter ticket for Linked List: ");
        String t = sc.nextLine();
        ticketList.add(t);
    }

    static void displayLinkedList() {
        System.out.println("Linked List Tickets: " + ticketList);
    }

    // Sorting
    static void bubbleSort() {

        int arr[] = {5,2,8,1,3};

        for(int i=0;i<arr.length;i++){
            for(int j=0;j<arr.length-i-1;j++){

                if(arr[j] > arr[j+1]){

                    int temp = arr[j];
                    arr[j] = arr[j+1];
                    arr[j+1] = temp;

                }

            }
        }

        System.out.println("Sorted Array:");
        for(int n:arr) {
            System.out.print(n + " ");
        }

        System.out.println();
    }

    // Searching
    static void linearSearch() {

        int arr[] = {10,20,30,40,50};

        System.out.print("Enter number to search: ");
        int target = sc.nextInt();
        sc.nextLine();

        for(int i=0;i<arr.length;i++){

            if(arr[i]==target){
                System.out.println("Element found at index " + i);
                return;
            }

        }

        System.out.println("Element not found");

    }

    // Menu
    static void menu() {

        while(true){

            System.out.println("\nCustomer Service DSA System");

            System.out.println("1 Add Ticket (Queue)");
            System.out.println("2 Process Ticket");
            System.out.println("3 Display Queue");

            System.out.println("4 Undo Action (Stack)");

            System.out.println("5 Add Ticket to Linked List");
            System.out.println("6 Display Linked List");

            System.out.println("7 Bubble Sort Example");
            System.out.println("8 Linear Search Example");

            System.out.println("0 Exit");

            System.out.print("Enter choice: ");
            int choice = sc.nextInt();
            sc.nextLine();

            switch(choice){

                case 1:
                    addTicket();
                    break;

                case 2:
                    processTicket();
                    break;

                case 3:
                    displayQueue();
                    break;

                case 4:
                    undoAction();
                    break;

                case 5:
                    addLinkedTicket();
                    break;

                case 6:
                    displayLinkedList();
                    break;

                case 7:
                    bubbleSort();
                    break;

                case 8:
                    linearSearch();
                    break;

                case 0:
                    System.exit(0);

                default:
                    System.out.println("Invalid choice");

            }

        }

    }

    public static void main(String[] args) {

        menu();

    }

}
