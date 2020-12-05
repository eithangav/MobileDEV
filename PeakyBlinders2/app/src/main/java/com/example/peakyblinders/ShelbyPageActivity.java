package com.example.peakyblinders;

import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.os.Bundle;

public class ShelbyPageActivity extends AppCompatActivity {

    RecyclerView recyclerView;

    String names[];
    int images[] = {R.drawable.tommy, R.drawable.arthur, R.drawable.polly,
                    R.drawable.john, R.drawable.finn, R.drawable.ada};

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_shelby_page);

        recyclerView = findViewById(R.id.recyclerView);

        names = getResources().getStringArray(R.array.shelbys_family);

        MyAdapter myAdapter = new MyAdapter(this, names, images);
        recyclerView.setAdapter(myAdapter);
        recyclerView.setLayoutManager(new LinearLayoutManager(this));

    }
}